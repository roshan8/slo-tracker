package incident

import (
	"fmt"
	"net/http"

	"slo-tracker/pkg/errors"
	"slo-tracker/pkg/respond"
	"slo-tracker/schema"
	"slo-tracker/utils"
)

// getAllIncidentsHandler fetches and unmarshal the incidentt data
func getAllIncidentsHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {

	// fetch the slo_id from contex
	ctx := r.Context()
	SLOID, _ := ctx.Value("SLOID").(uint)

	incidents, err := store.Incident().All(SLOID)
	if err != nil {
		return err
	}

	respond.OK(w, incidents)
	return nil
}

// creates a new incident
func createIncidentHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.IncidentReq

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	// fetch the slo_id from context and add it to incident creation request
	ctx := r.Context()
	input.SLOID, _ = ctx.Value("SLOID").(uint)

	// deduct error budget with incident downtime
	err := store.SLO().CutErrBudget(input.SLOID, input.ErrorBudgetSpent)
	if err != nil {
		fmt.Println("Unable to deduct error budget for the incident")
	}

	incident, err := store.Incident().Create(&input)
	if err != nil {
		return err
	}

	respond.Created(w, incident)
	return nil
}

// Get incident details by ID
func getIncidentHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	ctx := r.Context()
	incident, _ := ctx.Value("incident").(*schema.Incident)

	respond.OK(w, incident)
	return nil
}

// Updates the incident
func updateIncidentHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.Incident
	ctx := r.Context()
	incident, _ := ctx.Value("incident").(*schema.Incident)

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	updated, err := store.Incident().Update(incident, &input)
	if err != nil {
		return err
	}

	respond.OK(w, updated)
	return nil
}
