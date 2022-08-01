package main

import (
	"os"
	"errors"
	"log"
	"net/http"
	"path"
	"fmt"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/pocketbase/pocketbase/tools/rest"
	"github.com/pocketbase/pocketbase/tools/security"

	"github.com/golang-jwt/jwt/v4"
	_ "github.com/pocketbase/pocketbase/statik"
	"github.com/rakyll/statik/fs"
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
		  publicEmail := e.Record.GetStringDataValue("publicEmail");
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
		  if publicEmail != originalRecord.GetStringDataValue("publicEmail") {
				e.Record.SetDataValue("publicEmail", originalRecord.GetStringDataValue("publicEmail"));
		  }
		  if sellerStatus != originalRecord.GetStringDataValue("seller_status") {
				  e.Record.SetDataValue("seller_status", originalRecord.GetStringDataValue("seller_status"));
		  }
	 
		  return nil
	 })
	 
	 app.OnFileDownloadRequest().Add(func(e *core.FileDownloadEvent) error {
		  token := e.HttpContext.QueryParam("token")
		  collection, _ := app.Dao().FindCollectionByNameOrId("purchases")
		  record, _ := app.Dao().FindFirstRecordByData(collection, "resource", e.HttpContext.QueryParam("download"))
			 
		  if (e.Record.Collection().Name != "files") {
				  return nil
		  }
		  
		  user, err := app.Dao().FindUserByToken(token, e.HttpContext.QueryParam("download"))
		 
		  if err != nil || user.Id != record.GetStringDataValue("user") {
			  return rest.NewForbiddenError("Forbidden!", err)
		  }
		  
		  if err != nil {
				return rest.NewBadRequestError("Failed to download file.", err)
		  }
	 
		  return nil
	 })
	 
	 app.OnUserBeforeUpdateRequest().Add(func(e *core.UserUpdateEvent) error {
	 		collection, _ := app.Dao().FindCollectionByNameOrId("profiles")
			record, _ := app.Dao().FindFirstRecordByData(collection, "id", e.User.Profile.Id)
			
			record.SetDataValue("publicEmail", e.User.Email)
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
		
		statikFS, err := fs.New()
		
		if err != nil {
			log.Fatal(err)
		}
		
		h := http.FileServer(&indexWrapper{statikFS})
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
			Method: http.MethodGet,
			Path:   "/api/download/:id",
			Handler: func(c echo.Context) error {
				collection, _ := app.Dao().FindCollectionByNameOrId("purchases")
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
		
				return c.JSON(200, map[string]string{
					"token": token,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.RequireUserAuth(),
			},
		})


		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
