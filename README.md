### SLO-Tracker
A simple but effective way to track SLO's and Error budgets. `SLO-tracker` can be integrated with few alerting tools via webhook integration to receive SLO voilating incidents. 

### Motivation
SLO's are predefined way of saying what level of downtimes are acceptable for your product. Tracking SLO's and error budgets can be hard without proper tooling support. Since SLO's are directly related to user experience on your product, More and more companies are slowly adopting to [defining their SLO's](https://cloud.google.com/blog/products/devops-sre/availability-part-deux-cre-life-lessons). Even though lot of monitoring tools do provide SLO tracking feature out of the box, SRE's might use multiple set of tools for monitoring their [SLI's](https://newrelic.com/blog/best-practices/best-practices-for-setting-slos-and-slis-for-modern-complex-systems). and having single place to track the error budget is important. 

Sometimes self hosted monitoring tools might not have the longer retension policies making it hard to retain SLO metrics for longer period of time. Also false positive alerts can bring down error budget. 

### Installation and usage
```sh    
docker-compose up --build -d      
```    
> `admin:admin` is the default creds for UI, Which can be changed in docker-compose file.

### Supported integrations
- Prometheus
- Datadog
- Newrelic
- Pingdom
- SLO-Tracker API 

### Ref
https://opsmonk.dev/Tracking-error-budget-and-SLO/  


#### P.S: Sending all the alerts `SLO-tracker` from your monitoring tool defeats the purpose. Please send only SLO voilating incidents to this tool.
