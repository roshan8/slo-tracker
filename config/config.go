package config

import (
	"fmt"
	"os"
)

const (
	// EnvDev const represents dev environment
	EnvDev = "dev"
	// EnvStaging const represents staging environment
	EnvStaging = "staging"
	// EnvProduction const represents production environment
	EnvProduction = "production"
)

// Env holds the current environment
var (
	Env      string
	Port     string
	DBDriver string
	DBHost   string
	DBPort   string
	DBUser   string
	DBPass   string
	DBName   string
	DBDsn    string
)

// Initialize ...
func Initialize() {
	GetAllEnv()
	DBDsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		DBUser, DBPass, DBHost, DBPort, DBName)

}

// GetAllEnv should get all the env configs required for the app.
func GetAllEnv() {
	// API Configs
	mustEnv("ENV", &Env, EnvDev)
	mustEnv("PORT", &Port, "8080")
	mustEnv("DB_DRIVER", &DBDriver, "mysql")
	mustEnv("DB_HOST", &DBHost, "localhost")
	mustEnv("DB_PORT", &DBPort, "3306")
	mustEnv("DB_USER", &DBUser, "root")
	mustEnv("DB_PASS", &DBPass, "SecretPassword")
	mustEnv("DB_NAME", &DBName, "slotracker_dev")
}

// mustEnv get the env variable with the name 'key' and store it in 'value'
func mustEnv(key string, value *string, defaultVal string) {
	if *value = os.Getenv(key); *value == "" {
		*value = defaultVal
		fmt.Printf("%s env variable not set, using default value.\n", key)
	}
}
