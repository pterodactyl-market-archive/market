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
	
		dataFs := echo.MustSubFS(e.Router.Filesystem, path)		
		e.Router.GET("/data/*", apis.StaticDirectoryHandler(dataFs, false))

		e.Router.FileFS(
			"/",
			"index.html",
			echo.MustSubFS(e.Router.Filesystem, "market_frontend/dist/index.html"),
			middleware.Gzip(),
		)

		e.Router.GET(
			"/*",
			StaticDirectoryHandler(echo.MustSubFS(e.Router.Filesystem, "market_frontend/dist"), false),
			middleware.Gzip(),
			ActivityLogger(app),
		)
		
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
