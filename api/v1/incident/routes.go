package incident

import (
	"net/http"

	"sla-tracker/api"
	"sla-tracker/middleware"
	appstore "sla-tracker/store"

	"github.com/go-chi/chi"
)

// store holds shared store conn from the api
var store *appstore.Conn

// Init initializes all the v1 routes
func Init(r chi.Router) {

	store = api.Store

	r.Method(http.MethodGet, "/", api.Handler(getAllIncidentsHandler))
	r.Method(http.MethodPost, "/", api.Handler(createIncidentHandler))
	r.Route("/webhook", webhookSubRoutes)
	r.With(middleware.IncidentRequired).
		Route("/{incidentID:[0-9]+}", incidentIDSubRoutes)
}

// ROUTE: {host}/v1/incident/:incidentID/*
func incidentIDSubRoutes(r chi.Router) {
	r.Method(http.MethodGet, "/", api.Handler(getIncidentHandler))
	r.Method(http.MethodPatch, "/", api.Handler(updateIncidentHandler))
	// r.Method(http.MethodDelete, "/", api.Handler(deleteIncidentHandler))
}

func webhookSubRoutes(r chi.Router) {
	r.Method(http.MethodPost, "/newrelic", api.Handler(createNewrelicIncidentHandler))
	r.Method(http.MethodPost, "/prometheus", api.Handler(createPromIncidentHandler))
	r.Method(http.MethodPost, "/pingdom", api.Handler(createPingdomIncidentHandler))
}
