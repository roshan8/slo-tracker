package incident

import (
	"fmt"
	"net/http"
	"time"

	"slo-tracker/pkg/errors"
	"slo-tracker/pkg/respond"
	"slo-tracker/schema"
	"slo-tracker/utils"
)

// creates a new incident
func createDatadogIncidentHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {

	var input schema.DatadogIncidentReq

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	if input.Alerttransition == "Triggered" {

		incident, _ := store.Incident().GetBySLIName(input.Title)

		fmt.Println("Creating new incident")
		// There are no open incident for this SLI, creating new incident
		if incident == nil || incident.State != "open" {
			fmt.Println("Existing incident not found, so creating one now")
			incident, _ = store.Incident().Create(&schema.IncidentReq{
				SliName:          input.Title,
				Alertsource:      "Datadog",
				State:            "open",
				ErrorBudgetSpent: 0,
			})
			respond.Created(w, incident)
		}
	}

	if input.Alerttransition == "Recovered" {

		incident, err := store.Incident().GetBySLIName(input.Title)
		if err != nil {
			return errors.BadRequest(err.Error()).AddDebug(err)
		}

		updatedIncident := incident
		updatedIncident.State = "closed"
		updatedIncident.ErrorBudgetSpent = float32(time.Now().Sub(*incident.CreatedAt).Minutes())
		updated, _ := store.Incident().Update(incident, updatedIncident) // TODO: error handling

		// deduct error budget with incident downtime
		err = store.SLO().CutErrBudget(updatedIncident.ErrorBudgetSpent)

		respond.Created(w, updated)

	}
	return nil
}
