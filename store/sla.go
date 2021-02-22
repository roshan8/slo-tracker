package store

import (
	"fmt"
	"sla-tracker/pkg/errors"
	"sla-tracker/schema"
)

// SLAStore implements the SLA interface
type SLAStore struct {
	*Conn
}

// NewSLAStore ...
func NewSLAStore(st *Conn) *SLAStore {
	cs := &SLAStore{st}
	go cs.createTableIfNotExists()
	return cs
}

func (cs *SLAStore) createTableIfNotExists() {
	if !cs.DB.Migrator().HasTable(&schema.SLA{}) {
		if err := cs.DB.Migrator().CreateTable(&schema.SLA{}).Error; err != nil {
			fmt.Println(err)
		}
	}

}

// All returns all the SLAs
func (cs *SLAStore) All() ([]*schema.SLA, *errors.AppError) {
	var SLAs []*schema.SLA
	if err := cs.DB.Find(&SLAs).Error; err != nil { // For displaying all the columns
		// if err := cs.DB.Select("SliName, Alertsource, State, CreatedAt, ErrorBudgetSpent, MarkFalsePositive").Find(&SLAs).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return SLAs, nil
}

// Create a new SLA
func (cs *SLAStore) Create(req *schema.SLA) (*schema.SLA, *errors.AppError) {

	sla := &schema.SLA{
		ProductName:        req.ProductName,
		TargetSLA:          req.TargetSLA,
		CurrentSLA:         req.CurrentSLA,
		RemainingErrBudget: req.RemainingErrBudget,
	}
	if err := cs.DB.Save(sla).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return sla, nil
}

// Update the SLA record..
func (cs *SLAStore) Update(sla *schema.SLA, update *schema.SLA) (*schema.SLA, *errors.AppError) {
	if err := cs.DB.Model(sla).Updates(update).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return sla, nil
}
