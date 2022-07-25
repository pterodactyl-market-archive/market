package main

import (
	"os"
	"errors"
	"log"

	"github.com/labstack/echo/v5"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		path := "public_data"
		if _, err := os.Stat(path); errors.Is(err, os.ErrNotExist) {
			err := os.Mkdir(path, os.ModePerm)
			if err != nil {
				log.Fatal(err)
			}
		}
		
		distFs := echo.MustSubFS(e.Router.Filesystem, "market_frontend/dist")
		dataFs := echo.MustSubFS(e.Router.Filesystem, path)
		
		e.Router.GET("/*", echo.NotFoundHandler, middleware.StaticWithConfig(middleware.StaticConfig{
			Root:   distFs,
			Index:  "index.html",
			Browse: false,
			HTML5:  true,
		}))
		
		e.Router.GET("/data/*", apis.StaticDirectoryHandler(dataFs, false))

		
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
