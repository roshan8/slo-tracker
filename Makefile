NAME := slo-tracker
GO_VER := 1.17

all: fmt test build

fmt:
	docker run --rm -v $(CURDIR):/app:z -w /app golang:$(GO_VER) gofmt -l -w -s *.go

test:
	docker run --rm -v $(CURDIR):/app:z -w /app golang:$(GO_VER) go test -race -mod=vendor ./...

build:
	docker run --rm -v $(CURDIR):/app:z -e CGO_ENABLED=0 -w /app golang:$(GO_VER) go build -tags static,netgo -o $(NAME) .

vendor-update:
	rm -rf go.mod go.sum vendor/
	docker run --rm -v $(CURDIR):/app:z -w /app golang:$(GO_VER) go mod init $(NAME)
	docker run --rm -v $(CURDIR):/app:z -w /app golang:$(GO_VER) go mod tidy
	docker run --rm -v $(CURDIR):/app:z -w /app golang:$(GO_VER) go mod vendor

clean:
	rm -f $(NAME)
