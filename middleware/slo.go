package middleware

import (
	"fmt"
	"net/http"
	"slo-tracker/pkg/errors"
	"slo-tracker/pkg/respond"
	"strconv"

	"github.com/go-chi/chi"
)

// SLORequired validates
func SLORequired(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		SLOIDStr := chi.URLParam(r, "SLOID")
		SLOID, er := strconv.Atoi(SLOIDStr) // TODO: Add err handling by uncommenting below code

		if er != nil {
			respond.Fail(w, errors.BadRequest("Invalid SLO id/name").AddDebug(er))
			return
		}

		SLO, err := Store.SLO().GetByID(uint(SLOID))
		if err != nil {
			fmt.Println(err, SLO)
			respond.Fail(w, errors.BadRequest("Unable to find SLO").AddDebug(err))
			return
		}

		ctx := ContextWrapAll(r.Context(), map[interface{}]interface{}{
			"SLOID": uint(SLOID),
			"SLO":   SLO,
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	}

	return http.HandlerFunc(fn)
}
