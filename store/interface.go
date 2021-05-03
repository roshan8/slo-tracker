package store

import (
	"slo-tracker/pkg/errors"
	"slo-tracker/schema"
)

// Store global store interface - provides db interface methods
// for diff entities
type Store interface {
	Incident() Incident
	SLO() SLO
	// TODO: add others
}

// Incident store interface expose the Incident db methods/operations
type Incident interface {
	All() ([]*schema.Incident, *errors.AppError)
	Create(req *schema.IncidentReq) (*schema.Incident, *errors.AppError)
	GetByID(incidentID uint) (*schema.Incident, *errors.AppError)
	GetBySLIName(sliName string) (*schema.Incident, *errors.AppError)
	Update(incident *schema.Incident, update *schema.Incident) (*schema.Incident, *errors.AppError)
	// Delete(incidentID uint) *errors.AppError
}

// SLO store interface expose the SLO db methods/operations
type SLO interface {
	All() ([]*schema.SLO, *errors.AppError)
	Create(req *schema.SLO) (*schema.SLO, *errors.AppError)
	GetByID(SLOID uint) (*schema.SLO, *errors.AppError)
	GetByName(SLOName string) (*schema.SLO, *errors.AppError)
	Update(SLO *schema.SLO, update *schema.SLO) (*schema.SLO, *errors.AppError)
	CutErrBudget(SLOName string, downtimeInMins float32) *errors.AppError
}
