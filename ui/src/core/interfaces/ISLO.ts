export interface ISLO {
  id: number;
  slo_name: string;
  target_slo: number;
  current_slo: number;
  updated_at: Date;
  remaining_err_budget: number;
}
