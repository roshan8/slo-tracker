package store

import (
	"fmt"
	"slo-tracker/pkg/errors"
	"slo-tracker/schema"

	// appstore "slo-tracker/store"
	apputils "slo-tracker/utils"

	"gorm.io/gorm"
)

// SLOStore implements the SLO interface
type SLOStore struct {
	*Conn
}

// NewSLOStore ...
func NewSLOStore(st *Conn) *SLOStore {
	cs := &SLOStore{st}
	go cs.createTableIfNotExists()
	return cs
}

func (cs *SLOStore) createTableIfNotExists() {
	fmt.Println("Creating the slo table now!")
	if !cs.DB.Migrator().HasTable(&schema.SLO{}) {
		if err := cs.DB.Migrator().CreateTable(&schema.SLO{}).Error; err != nil {
			fmt.Println(err())
		}
	}

	// Create the first SLO record, Whenever use tries to
	// set their target SLO, patch calls will be made on this record
	fmt.Println("Creating the first record!")
	firstSLORecord := &schema.SLO{
		SLOName:            "Default",
		TargetSLO:          100,
		CurrentSLO:         100,
		RemainingErrBudget: 0,
	}
	if err := cs.DB.Save(firstSLORecord).Error; err != nil {
		fmt.Println(errors.InternalServerStd().AddDebug(err))
	}
	fmt.Println("Default SLO record got created")
}

// All returns all the SLOs
func (cs *SLOStore) All() ([]*schema.SLO, *errors.AppError) {
	var SLOs []*schema.SLO
	if err := cs.DB.Find(&SLOs).Error; err != nil { // For displaying all the columns
		// if err := cs.DB.Select("SliName, Alertsource, State, CreatedAt, ErrorBudgetSpent, MarkFalsePositive").Find(&SLOs).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return SLOs, nil
}

// GetByID returns the matched record for the given id
func (cs *SLOStore) GetByID(SLOID uint) (*schema.SLO, *errors.AppError) {
	var SLO schema.SLO
	if err := cs.DB.First(&SLO, "id=?", SLOID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.BadRequest("invalid SLO id").AddDebug(err)
		}
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	// calculate current slo based on RemainingErrBudget
	totalDowntimeInSec := (apputils.CalculateErrBudget(SLO.TargetSLO) - SLO.RemainingErrBudget) * 60
	SLO.CurrentSLO = ((31536000 - totalDowntimeInSec) / 31536000) * 100

	return &SLO, nil
}

// GetByName returns the matched record for the given slo_name
func (cs *SLOStore) GetByName(SLOName string) (*schema.SLO, *errors.AppError) {
	var SLO schema.SLO
	if err := cs.DB.First(&SLO, "slo_name=?", SLOName).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.BadRequest("invalid SLO name").AddDebug(err)
		}
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	// calculate current slo based on RemainingErrBudget
	totalDowntimeInSec := (apputils.CalculateErrBudget(SLO.TargetSLO) - SLO.RemainingErrBudget) * 60
	SLO.CurrentSLO = ((31536000 - totalDowntimeInSec) / 31536000) * 100

	return &SLO, nil
}

// Create a new SLO
func (cs *SLOStore) Create(req *schema.SLO) (*schema.SLO, *errors.AppError) {

	slo := &schema.SLO{
		SLOName:            req.SLOName,
		TargetSLO:          req.TargetSLO,
		CurrentSLO:         req.CurrentSLO,
		RemainingErrBudget: req.RemainingErrBudget,
	}
	if err := cs.DB.Save(slo).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return slo, nil
}

// Update the SLO record..
func (cs *SLOStore) Update(SLO *schema.SLO, update *schema.SLO) (*schema.SLO, *errors.AppError) {
	if err := cs.DB.Model(SLO).Updates(update).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}
	return SLO, nil
}

// Delete the SLO record..
func (cs *SLOStore) Delete(SLO *schema.SLO) *errors.AppError {
	if err := cs.DB.Delete(&SLO).Error; err != nil {
		return errors.InternalServerStd().AddDebug(err)
	}
	return nil
}

// CutErrBudget subtract the downtime mins from error budget
func (cs *SLOStore) CutErrBudget(SLOID uint, downtimeInMins float32) *errors.AppError {

	sloRecord, err := cs.GetByID(SLOID)

	if err != nil {
		return errors.InternalServerStd().AddDebug(err)
	}

	updatedSLOrecord := sloRecord
	updatedSLOrecord.RemainingErrBudget -= downtimeInMins
	updatedSLOrecord, err = cs.Update(sloRecord, updatedSLOrecord)

	if err != nil {
		return errors.InternalServerStd().AddDebug(err)
	}

	return nil
}
