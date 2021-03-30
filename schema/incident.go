package schema

import (
	"strings"
	"time"

	"sla-tracker/pkg/errors"
)

// Incident stores the incidentList response payload
type Incident struct {
	ID                uint       `json:"id,omitempty" sql:"primary_key"`
	SliName           string     `json:"sli_name"`
	Alertsource       string     `json:"alertsource"`
	State             string     `json:"state"`
	CreatedAt         *time.Time `json:"created_at,omitempty" sql:"default:current_timestamp"`
	ErrorBudgetSpent  float32    `json:"err_budget_spent"`
	MarkFalsePositive bool       `json:"mark_false_positive"`
}

// IncidentReq Schema stores the new incident creation/update request payload
type IncidentReq struct {
	SliName           string  `json:"sli_name"`
	Alertsource       string  `json:"alertsource"`
	State             string  `json:"state"`
	ErrorBudgetSpent  float32 `json:"err_budget_spent"`
	MarkFalsePositive bool    `json:"mark_false_positive"`
}

// Ok implements the Ok interface, it validates incident input
func (i *IncidentReq) Ok() error {
	switch {
	case strings.TrimSpace(i.SliName) == "":
		return errors.IsRequiredErr("SLI name")
	case strings.TrimSpace(i.Alertsource) == "":
		return errors.IsRequiredErr("Alertsource")
	}
	return nil
}

// PromIncidentReq stores the prometheus incident payload
type PromIncidentReq struct {
	Receiver string `json:"receiver"`
	Status   string `json:"status"`
	Alerts   []struct {
		Status string `json:"status"`
		Labels struct {
			Alertname string `json:"alertname"`
			Instance  string `json:"instance"`
		} `json:"labels"`
		StartsAt time.Time `json:"startsAt"`
		EndsAt   time.Time `json:"endsAt"`
	} `json:"alerts"`
}
