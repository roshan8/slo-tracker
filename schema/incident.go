package schema

import (
	"strings"
	"time"

	"sla-tracker/pkg/errors"
)

// IncidentListRes stores the incidentList response payload
type IncidentListRes struct {
	ID                uint       `json:"id,omitempty" sql:"primary_key"`
	Sli               string     `json:"sli_name"`
	Alertsource       string     `json:"alertsource"`
	State             string     `json:"state"`
	CreatedAt         *time.Time `json:"updated_at,omitempty" sql:"default:current_timestamp"`
	ErrorBudgetSpent  int        `json:"err_budget_spent"`
	MarkFalsePositive bool       `json:"mark_false_positive"`
}

// IncidentReq Schema stores the new incident creation request payload
type IncidentReq struct {
	Sli         string `json:"sli_name"`
	Alertsource string `json:"alertsource"`
}

// Ok implements the Ok interface, it validates user input
func (i *IncidentReq) Ok() error {
	switch {
	case strings.TrimSpace(i.Sli) == "":
		return errors.IsRequiredErr("SLI name")
	case strings.TrimSpace(i.Alertsource) == "":
		return errors.IsRequiredErr("Alertsource")
	}
	return nil
}
