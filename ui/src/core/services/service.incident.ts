import axios from "axios";
import { API } from ".";
import { IIncident } from "../interfaces/IIncident";
import { IResponse } from "../interfaces/IResponse";

class IncidentService {
  private _api = '';

  constructor(SLOId: string) {
    this._api = `${API}/api/v1/incident/${SLOId}`;
  }

  get = () => axios.get<IResponse<IIncident[]>>(this._api);

  create = (data: Pick<IIncident, 'sli_name' | 'alertsource' | 'err_budget_spent' | 'state'>) => axios.post<IResponse<IIncident>>(this._api, data);

}

export default IncidentService;
