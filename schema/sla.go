package schema

import (
	"time"
)

// SLA stores the SLA response payload
type SLA struct {
	ID                 uint       `json:"id,omitempty" sql:"primary_key"`
	ProductName        string     `json:"product_name"`
	TargetSLA          float32    `json:"target_sla"`
	CurrentSLA         float32    `json:"current_sla"`
	UpdatedAt          *time.Time `json:"updated_at,omitempty" sql:"default:current_timestamp"`
	RemainingErrBudget float32    `json:"remaining_err_budget"`
}

// // SLAReq Schema stores the new SLA creation request payload
// type SLAUpdateReq struct {
// 	RemainingErrBudget float32    `json:"remaining_err_budget"`
// 	SliName     string `json:"sli_name"`
// 	Alertsource string `json:"alertsource"`
// }

// // Ok implements the Ok interface, it validates user input
// func (i *SLAReq) Ok() error {
// 	switch {
// 	case strings.TrimSpace(i.SliName) == "":
// 		return errors.IsRequiredErr("SLI name")
// 	case strings.TrimSpace(i.Alertsource) == "":
// 		return errors.IsRequiredErr("Alertsource")
// 	}
// 	return nil
// }
