package utils

func CalculateErrBudget(targetSLAinPerc float32) float32 {
	totalSecsInYear := 31536000
	downtimeInFraction := 1 - (targetSLAinPerc / 100)
	errBudgetInMin := (downtimeInFraction * float32(totalSecsInYear)) / 60
	return errBudgetInMin
}
