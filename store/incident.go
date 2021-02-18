package store

import (
	"fmt"
	"sla-tracker/pkg/errors"
	"sla-tracker/schema"

	"gorm.io/gorm"
)

// UserStore implements the cities interface
type IncidentStore struct {
	*Conn
}

// NewUserStore ...
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

	// go cs.createIndexesIfNotExists()
}

// func (cs *IncidentStore) createIndexesIfNotExists() {
// 	scope := cs.DB.NewScope(&schema.Incident{})
// 	commonIndexes := getCommonIndexes(scope.TableName())
// 	for k, v := range commonIndexes {
// 		if !scope.Dialect().HasIndex(scope.TableName(), k) {
// 			err := cs.DB.Model(&schema.Incident{}).AddIndex(k, v).Error
// 			if err != nil {
// 				fmt.Println(err)
// 			}
// 		}
// 	}

// 	uniqueIndexes := map[string][]string{
// 		"idx_Incidents_name": []string{"name"},
// 	}
// 	for k, v := range uniqueIndexes {
// 		if !scope.Dialect().HasIndex(scope.TableName(), k) {
// 			if err := cs.DB.Model(&schema.Incident{}).AddUniqueIndex(k, v...).Error; err != nil {
// 				fmt.Println(err)
// 			}
// 		}
// 	}
// }

// All returns all the Incidents
func (cs *IncidentStore) All() ([]*schema.Incident, *errors.AppError) {
	var Incidents []*schema.Incident
	if err := cs.DB.Find(&Incidents).Error; err != nil { // For displaying all the columns
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

// Create a new Incident
func (cs *IncidentStore) Create(req *schema.IncidentReq) (*schema.Incident, *errors.AppError) {

	incident := &schema.Incident{
		SliName:     req.SliName,
		Alertsource: req.Alertsource,
	}
	if err := cs.DB.Save(incident).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return incident, nil
}
