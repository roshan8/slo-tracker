FROM golang:latest AS builder

LABEL app="slo-tracker"
LABEL maintainer="roshan.aloor@gmail.com"
LABEL version="0.0.1"
LABEL description="slo-tracker : Track your product SLO"

WORKDIR /app

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-w -s" -o /app/slo-tracker .


FROM scratch

# we don't need these certs for local development, but we copy in case you want
# to use this image for a production environment
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=builder /app/slo-tracker /app/slo-tracker

EXPOSE 8080

CMD ["/app/slo-tracker"]
