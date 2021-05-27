package slo

import (
	"net/http"

	"slo-tracker/api"
	"slo-tracker/middleware"

	appstore "slo-tracker/store"

	"github.com/go-chi/chi"
)

// store holds shared store conn from the api
var store *appstore.Conn

// Init initializes all the v1 routes
func Init(r chi.Router) {

	store = api.Store

	r.Method(http.MethodGet, "/", api.Handler(getAllSLOsHandler))
	r.Method(http.MethodPost, "/", api.Handler(createSLOHandler))
	r.With(middleware.SLORequired).
		Route("/{SLOName:[a-zA-Z1-9]+}", sloNameSubRoutes)
}

// ROUTE: {host}/v1/slo/:sloName/*
func sloNameSubRoutes(r chi.Router) {
	r.Method(http.MethodGet, "/", api.Handler(getSLOHandler))
	r.Method(http.MethodPatch, "/", api.Handler(updateSLOHandler))
	// r.Method(http.MethodDelete, "/", api.Handler(deleteSLOHandler))
}
