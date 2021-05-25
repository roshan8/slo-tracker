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
	// r.Route("/incident", incident.Init)

	// ROUTE: {host}/v1/incident/SLOName/:incidentID/*
	r.With(middleware.SLORequired).
		Route("/incident/{SLOName}", incident.Init) // TODO: Allow hyphen for sloname

	r.Route("/slo", slo.Init)
	// TODO: add remaining routes
}
