package sla

import (
	"net/http"

	"sla-tracker/pkg/errors"
	"sla-tracker/pkg/respond"
	"sla-tracker/schema"
	"sla-tracker/utils"
)

// getAllSLAsHandler fetches and unmarshal the sla data
func getAllSLAsHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	slas, err := store.SLA().All()
	if err != nil {
		return err
	}

	respond.OK(w, slas)
	return nil
}

func calculateErrBudget(targetSLAinPerc float32) float32 {
	totalSecInYear := 31536000
	downtimeInFraction := 1 - (targetSLAinPerc / 100)
	errBudgetInMin := (downtimeInFraction * float32(totalSecInYear)) / 60
	return errBudgetInMin
}

// creates a new sla
func createSLAHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.SLA

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	input.RemainingErrBudget = calculateErrBudget(input.TargetSLA)

	sla, err := store.SLA().Create(&input)
	if err != nil {
		return err
	}

	respond.Created(w, sla)
	return nil
}

// Get SLA details by ID
func getSLAHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	ctx := r.Context()
	SLA, _ := ctx.Value("SLA").(*schema.SLA)

	respond.OK(w, SLA)
	return nil
}

// Updates the sla
func updateSLAHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.SLA
	ctx := r.Context()
	sla, _ := ctx.Value("SLA").(*schema.SLA)

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	input.RemainingErrBudget = calculateErrBudget(input.TargetSLA)
	updated, err := store.SLA().Update(sla, &input)
	if err != nil {
		return err
	}

	respond.OK(w, updated)
	return nil
}
