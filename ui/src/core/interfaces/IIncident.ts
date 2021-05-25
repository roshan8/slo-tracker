
export interface IIncident {
  id: number;
  sli_name: string;
  slo_name: string;
  alertsource: string;
  state: string;
  created_at: Date;
  err_budget_spent: number;
  mark_false_positive: boolean;
}
