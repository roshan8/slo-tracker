package slo

import (
	"net/http"

	"slo-tracker/pkg/errors"
	"slo-tracker/pkg/respond"
	"slo-tracker/schema"
	"slo-tracker/utils"
)

// getAllSLOsHandler fetches and unmarshal the slo data
func getAllSLOsHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	slos, err := store.SLO().All()
	if err != nil {
		return err
	}

	respond.OK(w, slos)
	return nil
}

// creates a new slo
func createSLOHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.SLO

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	input.RemainingErrBudget = utils.CalculateErrBudget(input.TargetSLO)

	slo, err := store.SLO().Create(&input)
	if err != nil {
		return err
	}

	respond.Created(w, slo)
	return nil
}

// Get SLO details by ID
func getSLOHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	ctx := r.Context()
	SLO, _ := ctx.Value("SLO").(*schema.SLO)

	respond.OK(w, SLO)
	return nil
}

// Updates the slo
func updateSLOHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.SLO
	ctx := r.Context()
	slo, _ := ctx.Value("SLO").(*schema.SLO)

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	input.RemainingErrBudget = utils.CalculateErrBudget(input.TargetSLO)
	updated, err := store.SLO().Update(slo, &input)
	if err != nil {
		return err
	}

	respond.OK(w, updated)
	return nil
}

// Deletes the slo
func deleteSLOHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.SLO
	ctx := r.Context()
	slo, _ := ctx.Value("SLO").(*schema.SLO)

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	if err := store.SLO().Delete(slo); err != nil {
		return errors.InternalServerStd().AddDebug(err)
	}

	respond.OK(w, slo)
	return nil
}
