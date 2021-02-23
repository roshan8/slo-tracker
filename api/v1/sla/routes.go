package sla

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

	r.Method(http.MethodGet, "/", api.Handler(getAllSLAsHandler))
	r.Method(http.MethodPost, "/", api.Handler(createSLAHandler))
	r.With(middleware.SLARequired).
		Route("/{SLAID:1}", slaIDSubRoutes)
}

// ROUTE: {host}/v1/sla/:slaID/*
func slaIDSubRoutes(r chi.Router) {
	r.Method(http.MethodGet, "/", api.Handler(getSLAHandler))
	r.Method(http.MethodPatch, "/", api.Handler(updateSLAHandler))
	// r.Method(http.MethodDelete, "/", api.Handler(deleteSLAHandler))
}
