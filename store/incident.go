package store

import (
	"fmt"
	"slo-tracker/pkg/errors"
	"slo-tracker/schema"

	"gorm.io/gorm"
)

// IncidentStore implements the incident interface
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
func (cs *IncidentStore) All(SLOID uint) ([]*schema.Incident, *errors.AppError) {
	var Incidents []*schema.Incident
	if err := cs.DB.Order("created_at desc").Find(&Incidents, "slo_id=?", SLOID).Error; err != nil { // For displaying all the columns
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
func (cs *IncidentStore) GetBySLIName(sloID uint, sliName string) (*schema.Incident, *errors.AppError) {
	var incident schema.Incident
	if err := cs.DB.First(&incident, "state=? AND sli_name=? AND slo_id=?", "open", sliName, sloID).Error; err != nil {
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
		SLOID:            req.SLOID,
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

	if incident.MarkFalsePositive && !update.MarkFalsePositive {
		err = cs.SLOConn.CutErrBudget(incident.SLOID, incident.ErrorBudgetSpent)
	}

	if !incident.MarkFalsePositive && update.MarkFalsePositive {
		// Close the open incident if it's being marked as false positive
		if update.State == "open" {
			update.State = "closed"
		}
		err = cs.SLOConn.CutErrBudget(incident.SLOID, -incident.ErrorBudgetSpent)
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

// Deletes all the incidents matching SLOID field
func (cs *IncidentStore) Delete(SLOID uint) *errors.AppError {
	if err := cs.DB.Delete(schema.Incident{}, "slo_id = ?", SLOID).Error; err != nil {
		return errors.InternalServerStd().AddDebug(err)
	}
	return nil
}
