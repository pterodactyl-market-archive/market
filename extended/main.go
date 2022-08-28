package main

import (
	"os"
	"errors"
	"log"
	"net/http"
	"path"
	"fmt"
	"strconv"
	"strings"
	"io/ioutil"
	"encoding/json"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	
	"github.com/stripe/stripe-go/v72"
	"github.com/stripe/stripe-go/v72/checkout/session"
	"github.com/stripe/stripe-go/v72/webhook"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/market"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/daos"
	"github.com/pocketbase/pocketbase/tools/rest"
	"github.com/pocketbase/pocketbase/tools/security"

	"github.com/golang-jwt/jwt/v4"
	"github.com/spf13/cobra"
)

type indexWrapper struct {
	assets http.FileSystem
}

func (i *indexWrapper) Open(name string) (http.File, error) {
	ret, err := i.assets.Open(name)
	if !os.IsNotExist(err) || path.Ext(name) != "" {
		return ret, err
	}

	return i.assets.Open("/index.html")
}

func IsRecordUnique(dao *daos.Dao, record *models.Record) bool {
	var exists bool

	expr := dbx.HashExp{}
	data := record.Data()
	for k, v := range data {
		expr[k] = v
	}

	err := dao.RecordQuery(record.Collection()).
		Select("count(*)").
		AndWhere(dbx.Not(dbx.HashExp{"id": record.Id})).
		AndWhere(expr).
		Limit(1).
		Row(&exists)

	return err == nil && !exists
}

const (
	InfoColor    = "\033[1;34m%s\033[0m"
	NoticeColor  = "\033[1;36m%s\033[0m"
	SuccessColor  = "\033[1;32m%s\033[0m"
	WarningColor = "\033[1;33m%s\033[0m"
	ErrorColor   = "\033[1;31m%s\033[0m"
	DebugColor   = "\033[0;36m%s\033[0m"
)

func main() {
	app := pocketbase.New()
	 
	 app.OnRecordBeforeUpdateRequest().Add(func(e * core.RecordUpdateEvent) error {		 
		 admin, _ := e.HttpContext.Get(apis.ContextAdminKey).(*models.Admin)
		 
		  if admin != nil {
				return nil
		  }
		  if (e.Record.Collection().Name != "profiles") {
				return nil
		  }
	 
		  group := e.Record.GetStringDataValue("group");
		  sales := e.Record.GetStringDataValue("sales");
		  publicEmail := e.Record.GetStringDataValue("public_email");
		  sellerStatus := e.Record.GetStringDataValue("seller_status");
	 
		  originalRecord, err := app.Dao().FindRecordById(e.Record.Collection(), e.Record.Id, nil)
		  if err != nil {
				return err
		  }
		  if group != originalRecord.GetStringDataValue("group") {
				e.Record.SetDataValue("group", originalRecord.GetStringDataValue("group"));
		  }
		  if sales != originalRecord.GetStringDataValue("sales") {
				e.Record.SetDataValue("sales", originalRecord.GetStringDataValue("sales"));
		  }
		  if publicEmail != originalRecord.GetStringDataValue("public_email") {
				e.Record.SetDataValue("public_email", originalRecord.GetStringDataValue("public_email"));
		  }
		  if sellerStatus != originalRecord.GetStringDataValue("seller_status") {
				  e.Record.SetDataValue("seller_status", originalRecord.GetStringDataValue("seller_status"));
		  }
	 
		  return nil
	 })
	 
	 app.OnFileDownloadRequest().Add(func(e *core.FileDownloadEvent) error {
		  if (e.Record.Collection().Name != "files") {
				return nil
		  }
		  
		  token := e.HttpContext.QueryParam("token")
		  collection, _ := app.Dao().FindCollectionByNameOrId("purchases")
		  resources, _ := app.Dao().FindCollectionByNameOrId("resources")
		  record, _ := app.Dao().FindFirstRecordByData(collection, "resource", e.HttpContext.QueryParam("download"))
		  resource, _ := app.Dao().FindFirstRecordByData(resources, "id", e.HttpContext.QueryParam("download"))
		  downloads, _ := strconv.Atoi(resource.GetStringDataValue("downloads"))
		  
		  user, err := app.Dao().FindUserByToken(token, e.HttpContext.QueryParam("download"))
		 
		  if err != nil || user.Id != record.GetStringDataValue("user") {
				return rest.NewForbiddenError("Forbidden!", err)
		  }
		  
		  if err != nil {
				return rest.NewBadRequestError("Failed to download file.", err)
		  }
		  
		  resource.SetDataValue("downloads", downloads + 1)
		  err = app.Dao().SaveRecord(resource)
		  
		  if err != nil {
				return rest.NewBadRequestError("Failed to purchase, contact a admin.", err)
			}
		  
		  return nil
	 })
	 
	 app.OnUserBeforeUpdateRequest().Add(func(e *core.UserUpdateEvent) error {
	 		collection, _ := app.Dao().FindCollectionByNameOrId("profiles")
			record, _ := app.Dao().FindFirstRecordByData(collection, "id", e.User.Profile.Id)
			
			record.SetDataValue("public_email", e.User.Email)
			err := app.Dao().SaveRecord(record)
			
			if err != nil {
				return err
			}
			
			return nil
	  })
	  

	app.RootCmd.AddCommand(&cobra.Command{
		Use: "verify",
		Short: "Manually verifies specified user",
		Run: func(command *cobra.Command, args []string) {
			if (len(args) > 1) {
				fmt.Printf(WarningColor, "Only one email at a time can be verified\n")
			} else {
				user, err := app.Dao().FindUserByEmail(args[0]);
				if err != nil {
					fmt.Printf(ErrorColor, err)
					fmt.Println("")
					os.Exit(1)
				}
					user.Verified = true
				if err := app.Dao().SaveUser(user); err != nil {
					fmt.Println(ErrorColor, err)
					fmt.Println("")
					os.Exit(1)
				}
				fmt.Printf("\033[32mVerified user: \033[33m%s\n\033[0m", args[0])
			}
		 },
	})

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		path := "cdn"
		if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
			err := os.Mkdir(path, os.ModePerm)
			if err != nil {
				log.Fatal(err)
			}
		}
	
		dataFs := echo.MustSubFS(e.Router.Filesystem, path)
		e.Router.GET("/cdn/*", apis.StaticDirectoryHandler(dataFs, false), apis.ActivityLogger(app))
		
		httpFS := http.FS(market.DistDirFS)
		h := http.FileServer(&indexWrapper{httpFS})
		e.Router.GET("/*", echo.WrapHandler(http.StripPrefix("/", h)), middleware.Gzip(), apis.ActivityLogger(app))

		 e.Router.AddRoute(echo.Route{
				  Method: http.MethodGet,
				  Path:   "/api/profile/:id",
				  Handler: func(c echo.Context) error {
						id := c.PathParam("id")
						if id == "" {
							return rest.NewNotFoundError("", nil)
						}
						
						user, err := app.Dao().FindUserById(id)
						if err != nil || user == nil {
							return rest.NewNotFoundError("", err)
						}
						
						event := &core.UserViewEvent{
							HttpContext: c,
							User:        user,
						}
						
						return app.OnUserViewRequest().Trigger(event, func(e *core.UserViewEvent) error {
							return e.HttpContext.JSON(http.StatusOK, e.User)
						})
				  },
				  Middlewares: []echo.MiddlewareFunc{
						apis.RequireAdminOrOwnerAuth("id"),
						apis.ActivityLogger(app),
				  },
			 })
			
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/stripe/webhook",
			Handler: func(c echo.Context) error {
				  payload, err := ioutil.ReadAll(c.Request().Body)
				  
				  if err != nil {
					 fmt.Fprintf(os.Stderr, "Error reading request body: %v\n", err)
					 c.Response().WriteHeader(http.StatusServiceUnavailable)
					 return nil
				  }
				
				  endpointSecret := "whsec_r157djSeTujZgrcuIochNPzanxToWxDZ";
				  event, err := webhook.ConstructEvent(payload, c.Request().Header.Get("Stripe-Signature"),
					 endpointSecret)
				
				  if err != nil {
					 fmt.Fprintf(os.Stderr, "Error verifying webhook signature: %v\n", err)
					 c.Response().WriteHeader(http.StatusBadRequest) 
					 return nil
				  }
				
				  if event.Type == "checkout.session.completed" {
						var session stripe.CheckoutSession
						err := json.Unmarshal(event.Data.Raw, &session)
						if err != nil {
						  fmt.Fprintf(os.Stderr, "Error parsing webhook JSON: %v\n", err)
						  c.Response().WriteHeader(http.StatusBadRequest)
						  return rest.NewBadRequestError("Failed to purchase, contact a admin.", err)
						}
						
						resources, _ := app.Dao().FindCollectionByNameOrId("resources")
						purchases, _ := app.Dao().FindCollectionByNameOrId("purchases")
						profiles, _ := app.Dao().FindCollectionByNameOrId("profiles")
						checkout_arr := strings.Split(session.Metadata["product_id"], ",")
						
						for _, element := range checkout_arr {
							purchase := models.NewRecord(purchases)
							purchase.SetDataValue("resource", element)
							purchase.SetDataValue("user", session.Metadata["purchaser"])
													
							if (!IsRecordUnique(app.Dao(), purchase)) {
								return c.JSON(200, map[string]interface{}{
									 "message": "sending 200 status to disable stripe retry.",
									 "duplicate": true,
								 })
							}
							
							err = app.Dao().SaveRecord(purchase)
						}
						
						for _, element := range checkout_arr {
							record, _ := app.Dao().FindFirstRecordByData(resources, "id", element)
							seller, _ := app.Dao().FindFirstRecordByData(profiles, "id", record.GetStringDataValue("profile"))
							sales, _ := strconv.Atoi(seller.GetStringDataValue("sales"))
							
							seller.SetDataValue("sales", sales + 1)
							err = app.Dao().SaveRecord(seller)
							
							 if err != nil {
								 fmt.Fprintf(os.Stderr, "Error while saving DB: %v\n", err)
								 return rest.NewBadRequestError("Failed to purchase, contact a admin.", err)
							 }
						}
						 
						 return c.JSON(http.StatusOK, map[string]interface{}{
							 "message": "successful checkout",
							 "resource": checkout_arr,
						 })
					}
					
					if event.Type == "checkout.session.expired" {		
						 return c.JSON(http.StatusBadRequest, map[string]interface{}{
						 "session": map[string]interface{}{"expired": true},
					 })
					}
				
				  return c.NoContent(http.StatusOK)
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				middleware.BodyLimit(int64(65536)),
			},
		})			
						 
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/checkout/stripe/:id",
			Handler: func(c echo.Context) error {
			  resources, _ := app.Dao().FindCollectionByNameOrId("resources")
			  purchases, _ := app.Dao().FindCollectionByNameOrId("purchases")
			  user, _ := c.Get(apis.ContextUserKey).(*models.User)
			  checkout_arr := strings.Split(c.PathParam("id"), ",")
			  var StripeLineItems []*stripe.CheckoutSessionLineItemParams

			  for _, element := range checkout_arr {					 
					 expr := dbx.HashExp{"user": user.Id, "resource": element}
					 purchase, _ := app.Dao().FindRecordsByExpr(purchases, expr)
					 
					 if (len(purchase) > 0) {
							return c.JSON(409, map[string]interface{}{
								  "duplicate": true,
								  "error": "Resource already purchased.",
								  "resource": c.PathParam("id"),
							  })
						}
				}
				
				for _, element := range checkout_arr {
					 record, _ := app.Dao().FindFirstRecordByData(resources, "id", element)
					 price, _ := strconv.ParseInt(strings.Split(record.GetStringDataValue("price"), ".")[0], 10, 64)
					  
					 StripeLineItems = append(StripeLineItems, &stripe.CheckoutSessionLineItemParams{
						  PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
							Currency: stripe.String(string(stripe.CurrencyUSD)),
							UnitAmount: stripe.Int64(price),
							ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
							  Name: stripe.String(record.GetStringDataValue("name")),
							},
						 },
						 Quantity: stripe.Int64(1),
						 },
					 )	 
				 }
			  
			  stripe.Key = "sk_test_51LSoEhIquXPpAf2YG1clEz3qmBtybltqa5iq579kHunMZBZ7U94m5USrzxQAHCy4V0qz2Cmd6TySv0N67ZGw0EqX006Hzcnbrt"
			  domain := "https://beta.pterodactylmarket.com"
			  params := &stripe.CheckoutSessionParams{
				 LineItems: StripeLineItems,
				 CustomerEmail: stripe.String(user.Email),
				 Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
				 SuccessURL: stripe.String(domain + "/success"),
				 CancelURL: stripe.String(domain + "/cancelled"),
			  }
			
			  params.AddMetadata("purchaser", user.Id)
			  params.AddMetadata("product_id", c.PathParam("id"))
			  s, err := session.New(params)
			
			  if err != nil {
				 log.Printf("session.New: %v", err)
			  }
			  			
			  return c.JSON(http.StatusOK, map[string]interface{}{
				  "products": checkout_arr,
				  "session": s.URL,
				  "id": s.ID,
			  })
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.RequireUserAuth(),
				apis.ActivityLogger(app),
			},
		})		
		
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/download/:id",
			Handler: func(c echo.Context) error {
				collection, err := app.Dao().FindCollectionByNameOrId("purchases")
				record, _ := app.Dao().FindFirstRecordByData(collection, "resource", c.PathParam("id"))
				user, _ := c.Get(apis.ContextUserKey).(*models.User)
				id := c.PathParam("id")
		
				if user.Id != record.GetStringDataValue("user") {
					return rest.NewForbiddenError("Forbidden!", err)
				}
				
				token, err := security.NewToken(
					jwt.MapClaims{"id": user.Id, "type": "user"},
					(user.TokenKey + id),
					60,
				)
				if err != nil {
					return rest.NewBadRequestError("Failed to create token.", err)
				}
		
				return c.JSON(http.StatusOK, map[string]string{
					"token": token,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.RequireUserAuth(),
				apis.ActivityLogger(app),
			},
		})


		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
