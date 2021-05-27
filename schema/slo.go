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

// // SLOReq Schema stores the new SLO creation request payload
// type SLOUpdateReq struct {
// 	RemainingErrBudget float32    `json:"remaining_err_budget"`
// 	SliName     string `json:"sli_name"`
// 	Alertsource string `json:"alertsource"`
// }

// // Ok implements the Ok interface, it validates user input
// func (i *SLOReq) Ok() error {
// 	switch {
// 	case strings.TrimSpace(i.SliName) == "":
// 		return errors.IsRequiredErr("SLI name")
// 	case strings.TrimSpace(i.Alertsource) == "":
// 		return errors.IsRequiredErr("Alertsource")
// 	}
// 	return nil
// }
