package main

import (
	"os"
	"errors"
	"log"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/labstack/echo/v5/middleware"
	"github.com/pocketbase/pocketbase/market"
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
		e.Router.GET("/*",apis.StaticDirectoryHandler(market.DistDirFS, false), middleware.Gzip(),)
		
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
