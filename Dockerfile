FROM golang:latest

LABEL app="slo-tracker"
LABEL maintainer="roshan.aloor@gmail.com"
LABEL version="0.0.1"
LABEL description="slo-tracker : Track your product SLO"

RUN mkdir -p /app/ 
WORKDIR /app

COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /app/slo-tracker .


EXPOSE 8080

CMD /app/slo-tracker