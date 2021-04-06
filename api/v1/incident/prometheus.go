package incident

import (
	"fmt"
	"net/http"
	"time"

	"sla-tracker/pkg/errors"
	"sla-tracker/pkg/respond"
	"sla-tracker/schema"
	"sla-tracker/utils"
)

// creates a new incident
func createPromIncidentHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.PromIncidentReq

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	if input.Status == "firing" {
		for _, alert := range input.Alerts {
			incident, _ := store.Incident().GetBySLIName(alert.Labels.Alertname)

			// There are no open incident for this SLI, creating new incident
			if incident == nil || incident.State != "open" {
				fmt.Println("Existing incident not found, so creating one now")
				incident, _ = store.Incident().Create(&schema.IncidentReq{
					SliName:          alert.Labels.Alertname,
					Alertsource:      "Prometheus",
					State:            "open",
					ErrorBudgetSpent: 0,
				})
				respond.Created(w, incident)
			}
		}
	}

	if input.Status == "resolved" {
		for _, alert := range input.Alerts {
			incident, err := store.Incident().GetBySLIName(alert.Labels.Alertname)

			if err != nil {
				fmt.Println("Continue with the next alert")
				continue
			}

			updatedIncident := incident
			updatedIncident.State = "closed"
			updatedIncident.ErrorBudgetSpent = float32(time.Now().Sub(*incident.CreatedAt).Minutes())

			updated, _ := store.Incident().Update(incident, updatedIncident) // TODO: error handling

			// deduct error budget with incident downtime
			err = store.SLA().CutErrBudget(updatedIncident.ErrorBudgetSpent)

			respond.Created(w, updated)
		}
	}
	return nil
}
