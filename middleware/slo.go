package middleware

import (
	"net/http"
	"slo-tracker/pkg/respond"

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

		SLO, err := Store.SLO().GetByName(SLONameStr)
		if err != nil {
			fmt.Println(err, SLO)
			respond.Fail(w, errors.BadRequest("Unable to find SLO").AddDebug(err))
			return
		}

		ctx := ContextWrapAll(r.Context(), map[interface{}]interface{}{
			"SLOName": string(SLONameStr),
			"SLO":     SLO,
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	}

	return http.HandlerFunc(fn)
}
