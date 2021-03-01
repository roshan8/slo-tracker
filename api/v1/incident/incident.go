package incident

import (
	"net/http"

	"sla-tracker/pkg/errors"
	"sla-tracker/pkg/respond"
	"sla-tracker/schema"
	"sla-tracker/utils"
)

// getAllIncidentsHandler fetches and unmarshal the incidentt data
func getAllIncidentsHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	incidents, err := store.Incident().All()
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
