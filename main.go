package main

import (
	"fmt"
	"net/http"
	"slo-tracker/api"
	v1 "slo-tracker/api/v1"
	"slo-tracker/config"
	appmiddleware "slo-tracker/middleware"
	"slo-tracker/pkg/trace"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/rs/cors"
)

var (
	name    = "slo-tracker"
	version = "0.0.1"
)

func main() {
	config.Initialize()
	api.InitService(name, version)
	trace.Setup(config.Env)

	router := chi.NewRouter()
	cors := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "PUT", "PATCH", "OPTIONS", "DELETE"},
		AllowedHeaders: []string{
			"Origin", "Authorization", "Access-Control-Allow-Origin",
			"Access-Control-Allow-Header", "Accept",
			"Content-Type", "X-CSRF-Token",
		},
		ExposedHeaders: []string{
			"Content-Length", "Access-Control-Allow-Origin", "Origin",
		},
		AllowCredentials: true,
		MaxAge:           300,
	})

	// cross & loger middleware
	router.Use(cors.Handler)
	router.Use(
		middleware.Logger,
		appmiddleware.Recoverer,
	)

	// Initialize the version 1 routes of the API
	// router.Get("/", api.IndexHandeler)
	// router.Get("/top", api.HealthHandeler)
	// router.Route("/v1", v1.Init)
	router.Route("/", v1.Routes)

	trace.Log.Infof("Starting %s:%s on port :%s\n", name, version, config.Port)
	http.ListenAndServe(fmt.Sprintf(":%s", config.Port), router)
}
