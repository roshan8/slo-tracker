package incident

import (
	"fmt"
	"net/http"

	"sla-tracker/pkg/errors"
	"sla-tracker/schema"
	"sla-tracker/utils"
)

// creates a new incident
func createPromIncidentHandler(w http.ResponseWriter, r *http.Request) *errors.AppError {
	var input schema.PromIncidentReq

	if err := utils.Decode(r, &input); err != nil {
		return errors.BadRequest(err.Error()).AddDebug(err)
	}

	store.Incident().GetByID()

	fmt.Println(input)
	// incident := &schema.Incident{
	// 	SliName:          req.SliName,
	// 	Alertsource:      req.Alertsource,
	// 	State:            req.State,
	// 	ErrorBudgetSpent: req.ErrorBudgetSpent,
	// }

	// incident, err := store.Incident().Create(&in)
	// if err != nil {
	// 	return err
	// }

	// respond.Created(w, incident)
	return nil
}
