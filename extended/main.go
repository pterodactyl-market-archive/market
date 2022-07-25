package main

import (
	"log"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		subFs := echo.MustSubFS(e.Router.Filesystem, "public_data")
		e.Router.GET("/data/*", apis.StaticDirectoryHandler(subFs, false))

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
