package store

import (
	"fmt"
	"slo-tracker/pkg/errors"
	"slo-tracker/schema"

	"gorm.io/gorm"
)

// IncidentStore implements the cities interface
type IncidentStore struct {
	*Conn
}

// NewIncidentStore ...
func NewIncidentStore(st *Conn) *IncidentStore {
	cs := &IncidentStore{st}
	go cs.createTableIfNotExists()
	return cs
}

func (cs *IncidentStore) createTableIfNotExists() {
	if !cs.DB.Migrator().HasTable(&schema.Incident{}) {
		if err := cs.DB.Migrator().CreateTable(&schema.Incident{}).Error; err != nil {
			fmt.Println(err)
		}
	}

}

// All returns all the Incidents
func (cs *IncidentStore) All(SLOName string) ([]*schema.Incident, *errors.AppError) {
	var Incidents []*schema.Incident
	if err := cs.DB.Order("created_at desc").Find(&Incidents, "slo_name=?", SLOName).Error; err != nil { // For displaying all the columns
		// if err := cs.DB.Select("SliName, Alertsource, State, CreatedAt, ErrorBudgetSpent, MarkFalsePositive").Find(&Incidents).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return Incidents, nil
}

// GetByID returns the matched record for the given id
func (cs *IncidentStore) GetByID(incidentID uint) (*schema.Incident, *errors.AppError) {
	var incident schema.Incident
	if err := cs.DB.First(&incident, "id=?", incidentID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.BadRequest("invalid incident id").AddDebug(err)
		}
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return &incident, nil
}

// GetBySLIName returns the matched record for the given SLI
func (cs *IncidentStore) GetBySLIName(sliName string) (*schema.Incident, *errors.AppError) {
	var incident schema.Incident
	if err := cs.DB.First(&incident, "state=? AND sli_name=?", "open", sliName).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.InternalServerStd().AddDebug(err)
		}
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return &incident, nil
}

// Create a new Incident
func (cs *IncidentStore) Create(req *schema.IncidentReq) (*schema.Incident, *errors.AppError) {

	incident := &schema.Incident{
		SliName:          req.SliName,
		SLOName:          req.SLOName,
		Alertsource:      req.Alertsource,
		State:            req.State,
		ErrorBudgetSpent: req.ErrorBudgetSpent,
	}
	if err := cs.DB.Save(incident).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return incident, nil
}

// Update the incident record..
func (cs *IncidentStore) Update(incident *schema.Incident, update *schema.Incident) (*schema.Incident, *errors.AppError) {

	var err *errors.AppError

	if incident.MarkFalsePositive == true && update.MarkFalsePositive == false {
		err = cs.SLOConn.CutErrBudget(incident.SLOName, incident.ErrorBudgetSpent)
	}

	if incident.MarkFalsePositive == false && update.MarkFalsePositive == true {
		err = cs.SLOConn.CutErrBudget(incident.SLOName, -incident.ErrorBudgetSpent)
	}

	if err != nil {
		return nil, errors.BadRequest(err.Error()).AddDebug(err)
	}

	if err := cs.DB.Model(incident).Updates(map[string]interface{}{
		"State":             update.State,
		"ErrorBudgetSpent":  update.ErrorBudgetSpent,
		"MarkFalsePositive": update.MarkFalsePositive,
	}).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return incident, nil
}
