package api

import (
	"net/http"
	"sla-tracker/middleware"
	"sla-tracker/pkg/errors"
	"sla-tracker/pkg/respond"
	"sla-tracker/pkg/trace"
	"sla-tracker/store"
	"time"
)

// Store holds new store connection
var Store *store.Conn

// ServiceInfo stores basic service information
type ServiceInfo struct {
	Name    string    `json:"name"`
	Version string    `json:"version"`
	Uptime  time.Time `json:"uptime"`
	Epoch   int64     `json:"epoch"`
}

// ServiceName holds the service which connected to
var ServiceName = ""
var serviceInfo *ServiceInfo

// InitService sets the service name
func InitService(name, version string) {
	ServiceName = name
	serviceInfo = &ServiceInfo{
		Name:    name,
		Version: version,
		Uptime:  time.Now(),
		Epoch:   time.Now().Unix(),
	}

	Store = store.NewStore()
	middleware.Init(Store)
}

// API Handler's ---------------------------------------------------------------

// Handler custom api handler help us to handle all the errors in one place
type Handler func(w http.ResponseWriter, r *http.Request) *errors.AppError

func (f Handler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	err := f(w, r)
	if err != nil {
		// APP Level Error
		trace.Log.Infof("ServiceName: %s, StatusCode: %d, Error: %s\n DEBUG: %+v\n",
			ServiceName, err.Status, err.Error(), err.Debug)
		respond.Fail(w, err)
	}
}

// Basic Handler func ---------------------------------------------------------------

// IndexHandeler common index handler for all the service
func IndexHandeler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	respond.OK(w, map[string]string{
		"name":    serviceInfo.Name,
		"version": serviceInfo.Version,
	})
	return nil
}

// HealthHandeler return basic service info
func HealthHandeler(w http.ResponseWriter, r *http.Request) {
	respond.OK(w, serviceInfo)
}
