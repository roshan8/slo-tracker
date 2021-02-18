package store

import (
	"sla-tracker/pkg/errors"
	"sla-tracker/schema"
)

// Store global store interface - provides db interface methods
// for diff entities
type Store interface {
	Incident() Incident
	// TODO: add others
}

// Incident store interface expose the Incident db methods/operations
type Incident interface {
	All() ([]*schema.Incident, *errors.AppError)
	Create(req *schema.IncidentReq) (*schema.Incident, *errors.AppError)
	GetByID(incidentID uint) (*schema.Incident, *errors.AppError)
	// Update(city *schema.City, update *schema.City) (*schema.City, *errors.AppError)
	// Delete(cityID uint) *errors.AppError
}
