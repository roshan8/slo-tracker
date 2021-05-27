package schema

import (
	"time"
)

// SLO stores the SLO response payload
type SLO struct {
	ID                 uint       `json:"id,omitempty" sql:"primary_key"`
	SLOName            string     `json:"slo_name" gorm:"unique;not null"`
	TargetSLO          float32    `json:"target_slo"`
	CurrentSLO         float32    `json:"current_slo"`
	UpdatedAt          *time.Time `json:"updated_at,omitempty" sql:"default:current_timestamp"`
	RemainingErrBudget float32    `json:"remaining_err_budget"`
}
