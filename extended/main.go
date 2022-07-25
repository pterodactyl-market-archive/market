package main

import (
	"os"
	"errors"
	"log"

	"github.com/labstack/echo/v5"
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
		
		subFs := echo.MustSubFS(e.Router.Filesystem, path)
		e.Router.GET("/data/*", apis.StaticDirectoryHandler(subFs, false))
		
                subFs := echo.MustSubFS(e.Router.Filesystem, "market_frontend/dist")
		e.Router.GET("/*", apis.StaticDirectoryHandler(subFs, false))
		
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
