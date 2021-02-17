package trace

import (
	"go.uber.org/zap"
)

// Log ...
var Log *zap.SugaredLogger

// Setup ...
func Setup(level string) {
	var zlog *zap.Logger
	switch level {
	case "dev":
		zlog, _ = zap.NewDevelopment()
	case "production":
		zlog, _ = zap.NewProduction()
	case "none":
		zlog = zap.NewNop()
	default:
		zlog, _ = zap.NewDevelopment()
	}
	// This condition is to avoid race conditions in test cases
	if Log == nil {
		Log = zlog.Sugar()
	}
}
