package middleware

import (
	"fmt"
	"net/http"
	"sla-tracker/pkg/errors"
	"sla-tracker/pkg/respond"
	"strconv"

	"github.com/go-chi/chi"
)

// SLARequired validates
func SLARequired(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		SLAIDStr := chi.URLParam(r, "SLAID")
		SLAID, er := strconv.Atoi(SLAIDStr)

		if er != nil {
			fmt.Println(SLAIDStr)
			respond.Fail(w, errors.BadRequest("Invalid SLA id").AddDebug(er))
			return
		}

		SLA, err := Store.SLA().GetByID(uint(SLAID))
		if err != nil {
			respond.Fail(w, err)
			return
		}

		ctx := ContextWrapAll(r.Context(), map[interface{}]interface{}{
			"SLAID": uint(SLAID),
			"SLA":   SLA,
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	}

	return http.HandlerFunc(fn)
}
