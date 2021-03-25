FROM golang:latest

LABEL app="sla-tracker"
LABEL maintainer="roshan.aloor@gmail.com"
LABEL version="0.0.1"
LABEL description="sla-tracker : Track your product SLA"

RUN mkdir -p /app/ 
# && apk update && apk add --no-cache ca-certificates


# RUN go build -o sla-tracker

# RUN go build -o sla-tracker .
# RUN ls
COPY sla-tracker /app/

WORKDIR /app
EXPOSE 8080

# /config is where the squadcast-config configMap is mounted
CMD /app/sla-tracker