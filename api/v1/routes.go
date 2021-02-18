package v1

import (
	"net/http"
	"sla-tracker/api"
	v1 "sla-tracker/api"
	"sla-tracker/api/v1/incident"

	"github.com/go-chi/chi"
)

// Routes registered routes
func Routes(r chi.Router) {
	r.Route("/api/v1", Init)
	r.Method(http.MethodGet, "/", v1.Handler(api.IndexHandeler))
	// r.Get("/top", api.HealthHandeler)
}

// Init initializes all the v1 routes
func Init(r chi.Router) {
	r.Route("/incident", incident.Init)
	// TODO: add remaining routes
}
