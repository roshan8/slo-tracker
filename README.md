## SLO-Tracker
A simple but effective way to track SLO's and Error budgets. `SLO-tracker` can be integrated with Prometheus, Pingdom, Datadog and Newrelic via webhook to receive SLO voilating incidents. Sending all the alerts `SLO-tracker` defeats the purpose of this tool. Please send only SLO voilating incidents to this tool.

## How to deploy?
```sh    
docker-compose up -d      
```    
> `admin:admin` is the default creds for UI, Which can be changed in docker-compose file.

## Ref
https://opsmonk.dev/Tracking-error-budget-and-SLO/  