export interface IIncident {
  id: number;
  sli_name: string;
  slo_id: number;
  alertsource: string;
  state: string;
  created_at: Date;
  err_budget_spent: number;
  mark_false_positive: boolean;
}

export interface IIncidentSummary {
  id: string;
  label: string;
  value: number;
}

export interface IErrorBudget {
  x: string;
  y: number;
}
