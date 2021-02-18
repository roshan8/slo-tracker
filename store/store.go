package store

import (
	"fmt"
	"log"
	"sla-tracker/config"
	"sla-tracker/schema"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var dbConn *gorm.DB

// Init ...
func Init() {
	// db, err := gorm.Open(config.DBDriver, config.DBDataSource)
	db, err := gorm.Open(sqlite.Open(config.DBName), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}
	dbConn = db
	db.AutoMigrate(
		&schema.Incident{},
		//TODO: add other schemas
	)
}

// Conn struct holds the store connection
type Conn struct {
	DB           *gorm.DB
	IncidentConn Incident
	// TODO: add other connection
}

// NewStore inits new store connection
func NewStore() *Conn {
	Init()
	conn := &Conn{
		DB: dbConn,
	}
	conn.IncidentConn = NewIncidentStore(conn)
	// TODO: Add other connections

	return conn
}

// Incident implements the store interface and it returns the Incident interface
func (s *Conn) Incident() Incident {
	return s.IncidentConn
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
