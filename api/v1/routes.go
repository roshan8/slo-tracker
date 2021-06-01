package v1

import (
	"net/http"
	"slo-tracker/api"
	v1 "slo-tracker/api"
	"slo-tracker/api/v1/incident"
	"slo-tracker/api/v1/slo"
	"slo-tracker/middleware"

	"github.com/go-chi/chi"
)

// Routes registered routes
func Routes(r chi.Router) {
	r.Route("/api/v1", Init)
	r.Method(http.MethodGet, "/", v1.Handler(api.IndexHandeler))
	r.Get("/top", api.HealthHandeler)
	// r.Get("/top", api.HealthHandeler)
}

// Init initializes all the v1 routes
func Init(r chi.Router) {
	// ROUTE: {host}/v1/incident/SLOID/:incidentID/*
	r.With(middleware.SLORequired).
		Route("/incident/{SLOID}", incident.Init)
	r.Route("/slo", slo.Init)
}
