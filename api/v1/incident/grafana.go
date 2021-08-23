package incident

import (
	"net/http"
	"time"

	"slo-tracker/pkg/errors"
	"slo-tracker/pkg/respond"
	"slo-tracker/schema"
	"slo-tracker/utils"
)

// create a new incident
func createGrafanaIncidentHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {

	var input schema.GrafanaIncidentReq

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	// fetch the slo_id from context and add it to incident creation request
	ctx := r.Context()
	SLOID, _ := ctx.Value("SLOID").(uint)

	if input.State == "alerting" {
		incident, _ := store.Incident().GetBySLIName(SLOID, input.RuleName)

		// If there are no open incident for this SLI, creating new incident
		if incident == nil || incident.State != "open" {
			incident, _ = store.Incident().Create(&schema.IncidentReq{
				SliName:          input.RuleName,
				SLOID:            SLOID,
				Alertsource:      "Grafana",
				State:            "open",
				ErrorBudgetSpent: 0,
			})
			respond.Created(w, incident)
		}
	}

	if input.State == "ok" {
		incident, err := store.Incident().GetBySLIName(SLOID, input.RuleName)
		if err != nil {
			return errors.BadRequest(err.Error()).AddDebug(err)
		}

		updatedIncident := incident
		updatedIncident.State = "closed"
		updatedIncident.ErrorBudgetSpent = float32(time.Since(*incident.CreatedAt).Minutes())

		updated, _ := store.Incident().Update(incident, updatedIncident) // TODO: error handling

		// deduct error budget with incident downtime
		store.SLO().CutErrBudget(updated.SLOID, updatedIncident.ErrorBudgetSpent)

		respond.Created(w, updated)
	}

	return nil
}
