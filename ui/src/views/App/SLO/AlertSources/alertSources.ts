import { IAlertSource } from '../../../../core/interfaces/IAlertSource';

const alertSources: IAlertSource[] = [
  {
    name: 'New Relic',
    id: 'newrelic',
  },
  {
    name: 'Prometheus',
    id: 'prometheus',
  },
  {
    name: 'Pingdom',
    id: 'pingdom',
  },
  {
    name: 'Data Dog',
    id: 'datadog',
  },
  {
    name: 'Grafana',
    id: 'grafana'
  }
];

export default alertSources;
