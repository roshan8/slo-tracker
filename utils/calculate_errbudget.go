package utils

func CalculateErrBudget(targetSLOinPerc float32) float32 {
	totalSecsInYear := 31536000
	downtimeInFraction := 1 - (targetSLOinPerc / 100)
	errBudgetInMin := (downtimeInFraction * float32(totalSecsInYear)) / 60
	return errBudgetInMin
}
