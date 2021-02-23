package store

import (
	"sla-tracker/pkg/errors"
	"sla-tracker/schema"
)

// Store global store interface - provides db interface methods
// for diff entities
type Store interface {
	Incident() Incident
	SLA() SLA
	// TODO: add others
}

// Incident store interface expose the Incident db methods/operations
type Incident interface {
	All() ([]*schema.Incident, *errors.AppError)
	Create(req *schema.IncidentReq) (*schema.Incident, *errors.AppError)
	GetByID(incidentID uint) (*schema.Incident, *errors.AppError)
	Update(incident *schema.Incident, update *schema.Incident) (*schema.Incident, *errors.AppError)
	// Delete(cityID uint) *errors.AppError
}

// SLA store interface expose the SLA db methods/operations
type SLA interface {
	All() ([]*schema.SLA, *errors.AppError)
	Create(req *schema.SLA) (*schema.SLA, *errors.AppError)
	GetByID(SLAID uint) (*schema.SLA, *errors.AppError)
	Update(sla *schema.SLA, update *schema.SLA) (*schema.SLA, *errors.AppError)
}
