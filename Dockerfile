FROM golang:latest

LABEL app="sla-tracker"
LABEL maintainer="roshan.aloor@gmail.com"
LABEL version="0.0.1"
LABEL description="sla-tracker : Track your product SLA"

RUN mkdir -p /app/ 
WORKDIR /app

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/sla-tracker .


EXPOSE 8080

CMD /app/sla-tracker