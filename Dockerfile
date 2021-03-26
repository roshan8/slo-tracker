FROM golang:latest

LABEL app="sla-tracker"
LABEL maintainer="roshan.aloor@gmail.com"
LABEL version="0.0.1"
LABEL description="sla-tracker : Track your product SLA"

RUN mkdir -p /app/ 
COPY ./sla-tracker /app/
WORKDIR /app

EXPOSE 8080

CMD /app/sla-tracker