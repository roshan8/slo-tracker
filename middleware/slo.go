package middleware

import (
	"net/http"
	"slo-tracker/pkg/respond"

	"github.com/go-chi/chi"
)

// SLORequired validates
func SLORequired(next http.Handler) http.Handler {
	fn := func(w http.ResponseWriter, r *http.Request) {
		SLONameStr := chi.URLParam(r, "SLOName")
		// SLOName, _ := strconv.Atoi(SLONameStr) // TODO: Add err handling by uncommenting below code

		// if er != nil {
		// 	fmt.Println(SLONameStr)
		// 	respond.Fail(w, errors.BadRequest("Invalid SLO id/name").AddDebug(er))
		// 	return
		// }

		SLO, err := Store.SLO().GetByName(SLONameStr)
		if err != nil {
			respond.Fail(w, err)
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
