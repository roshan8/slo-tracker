# SLO-Tracker
A simple but effective way to track SLO's and Error budgets. `SLO-tracker` can be integrated with Prometheus, Pingdom and Newrelic via webhook to receive SLO voilating incidents. Send all the alerts `SLO-tracker` defeats the purpose of this tool. Please send only SLO voilating incidents to this tool.

# How to deploy?
```sh    
docker-compose up -d      
```    
> `admin:admin` is the default creds for UI, Which can be changed in docker-compose file.

# Ref
https://opsmonk.dev/Tracking-error-budget-and-SLO/  

# TODO
[x] - Add SLO burn rate graph    
[x] - Fix false positive button   
[x] - Fix ErrBudget summary pie chart            
[x] - Add pingdom integration    
[ ] - Datadog integration     
[ ] - Don't reduce err budget twice for simultaniously running incidents 


