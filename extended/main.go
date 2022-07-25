package main

import (
	"os"
	"errors"
	"log"
	"net/http"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	_ "github.com/pocketbase/pocketbase/statik"
	"github.com/rakyll/statik/fs"
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
		
		statikFS, err := fs.New()
		
		if err != nil {
			log.Fatal(err)
		}
		
		h := http.FileServer(statikFS)
		e.Router.GET("/*", echo.WrapHandler(http.StripPrefix("/", h)))
		
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
