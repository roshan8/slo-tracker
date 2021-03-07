package store

import (
	"fmt"
	"sla-tracker/pkg/errors"
	"sla-tracker/schema"

	// appstore "sla-tracker/store"

	"gorm.io/gorm"
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
	fmt.Println("Creating the sla table now!")
	if !cs.DB.Migrator().HasTable(&schema.SLA{}) {
		if err := cs.DB.Migrator().CreateTable(&schema.SLA{}).Error; err != nil {
			fmt.Println(err)
		}
		// Create the first SLA record, Whenever use tries to
		// set their target SLA, patch calls will be made on this record
		fmt.Println("Creating the first record!")
		firstSLARecord := &schema.SLA{
			ProductName:        "Unnamed",
			TargetSLA:          100,
			CurrentSLA:         100,
			RemainingErrBudget: 0,
		}
		if err := cs.DB.Save(firstSLARecord).Error; err != nil {
			fmt.Println(errors.InternalServerStd().AddDebug(err))
		}
		fmt.Println("First SLA record got created")
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

// GetByID returns the matched record for the given id
func (cs *SLAStore) GetByID(SLAID uint) (*schema.SLA, *errors.AppError) {
	var SLA schema.SLA
	if err := cs.DB.First(&SLA, "id=?", SLAID).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return nil, errors.BadRequest("invalid SLA id").AddDebug(err)
		}
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return &SLA, nil
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
func (cs *SLAStore) Update(SLA *schema.SLA, update *schema.SLA) (*schema.SLA, *errors.AppError) {
	if err := cs.DB.Model(SLA).Updates(update).Error; err != nil {
		return nil, errors.InternalServerStd().AddDebug(err)
	}

	return SLA, nil
}

// CutErrBudget subtract the downtime mins from error budget
func (cs *SLAStore) CutErrBudget(downtimeInMins float32) *errors.AppError {

	slaRecord, err := cs.GetByID(1)

	if err != nil {
		return errors.InternalServerStd().AddDebug(err)
	}

	updatedSLArecord := slaRecord
	updatedSLArecord.RemainingErrBudget -= downtimeInMins
	updatedSLArecord, err = cs.Update(slaRecord, updatedSLArecord)

	if err != nil {
		return errors.InternalServerStd().AddDebug(err)
	}

	return nil
}
