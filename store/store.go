package store

import (
	"database/sql"
	"fmt"
	"log"
	"slo-tracker/config"
	"slo-tracker/schema"

	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var dbConn *gorm.DB

// Init ...
func Init() {

	// Connect to mysql using sql driver and create a database
	dbConnectionString := fmt.Sprintf("root:SecretPassword@tcp(%s:3306)/", config.DBHost)
	db, err := sql.Open("mysql", dbConnectionString)
	if err != nil {
		panic(err)
	}
	_, _ = db.Exec("CREATE DATABASE IF NOT EXISTS " + config.DBName)
	db.Close()

	// Connect to newrely created database using gorm
	dbConnectionString = fmt.Sprintf("root:SecretPassword@tcp(%s:3306)/slotracker_dev?charset=utf8mb4&parseTime=True&loc=Local", config.DBHost)
	gormDb, err := gorm.Open(mysql.Open(dbConnectionString), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	dbConn = gormDb
	gormDb.AutoMigrate(
		&schema.Incident{},
		&schema.IncidentReq{},
		&schema.SLO{},
		//TODO: add other schemas
	)
}

// Conn struct holds the store connection
type Conn struct {
	DB           *gorm.DB
	IncidentConn Incident
	SLOConn      SLO
	// TODO: add other connection
}

// NewStore inits new store connection
func NewStore() *Conn {
	Init()
	conn := &Conn{
		DB: dbConn,
	}
	conn.IncidentConn = NewIncidentStore(conn)
	conn.SLOConn = NewSLOStore(conn)
	// TODO: Add other connections

	return conn
}

// Incident implements the store interface and it returns the Incident interface
func (s *Conn) Incident() Incident {
	return s.IncidentConn
}

// SLO implements the store interface and it returns the SLO interface
func (s *Conn) SLO() SLO {
	return s.SLOConn
}

func getCommonIndexes(tableName string) map[string]string {
	idx := fmt.Sprintf("idx_%s", tableName)
	return map[string]string{
		fmt.Sprintf("%s_created_at", idx): "created_at",
		fmt.Sprintf("%s_updated_at", idx): "updated_at",
	}
}

// recordExists should check if record is avail or not for particular table
// based on the given condition.
func recordExists(tableName, where string) (exists bool) {
	baseQ := fmt.Sprintf("select 1 from %s where %v", tableName, where)
	dbConn.Raw(fmt.Sprintf("select exists (%v)", baseQ)).Row().Scan(&exists)
	return
}
