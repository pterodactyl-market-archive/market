package main

import (
	"os"
	"errors"
	"log"
	"net/http"
	"path"

	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	_ "github.com/pocketbase/pocketbase/statik"
	"github.com/rakyll/statik/fs"
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
		
		h := http.FileServer(&indexWrapper{statikFS})
		e.Router.GET("/*", echo.WrapHandler(http.StripPrefix("/", h)))
		
		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
