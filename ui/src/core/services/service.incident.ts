import axios from "axios";
import { API } from ".";
import { IIncident } from "../interfaces/IIncident";
import { IResponse } from "../interfaces/IResponse";

class IncidentService {
  private _api = '';

  constructor(SLOId: number) {
    this._api = `${API}/api/v1/incident/${SLOId}`;
  }

  get = () => axios.get<IResponse<IIncident[]>>(this._api);

  create = (data: Pick<IIncident, 'sli_name' | 'alertsource' | 'err_budget_spent' | 'state'>) => axios.post<IResponse<IIncident>>(this._api, data);

  update = (incidentID: number, data: Partial<IIncident>) => axios.patch(`${this._api}/${incidentID}`, data);
}

export default IncidentService;
