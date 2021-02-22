package sla

import (
	"net/http"

	"sla-tracker/pkg/errors"
	"sla-tracker/pkg/respond"
	"sla-tracker/schema"
	"sla-tracker/utils"
)

// InitUsers fetches and unmarshal the user data from yaml config files
func getAllSLAsHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	slas, err := store.SLA().All()
	if err != nil {
		return err
	}

	respond.OK(w, slas)
	return nil
}

// creates a new sla
func createSLAHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.SLA

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	sla, err := store.SLA().Create(&input)
	if err != nil {
		return err
	}

	respond.Created(w, sla)
	return nil
}

// Updates the sla
func updateSLAHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.SLA
	ctx := r.Context()
	sla, _ := ctx.Value("sla").(*schema.SLA)

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	updated, err := store.SLA().Update(sla, &input)
	if err != nil {
		return err
	}

	respond.OK(w, updated)
	return nil
}
