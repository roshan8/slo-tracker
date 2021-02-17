package schema

import "time"

// BaseSchema ...
type BaseSchema struct {
	ID        uint       `json:"id,omitempty" sql:"primary_key"`
	CreatedAt *time.Time `json:"updated_at,omitempty" sql:"default:current_timestamp"`
}

// Ok interface/method validates the struct data
type Ok interface {
	Ok() error
}
