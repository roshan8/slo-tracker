import axios from "axios";
import { API } from ".";
import { IResponse } from "../interfaces/IResponse";
import { ISLO } from "../interfaces/ISLO";

class SLOService {
  private _api = `${API}/api/v1/slo`;

  all = () => axios.get<IResponse<ISLO[]>>(this._api);

  get = (sloId: string) => axios.get<IResponse<ISLO>>(`${this._api}/${sloId}`)

  create = (data: Pick<ISLO, 'slo_name' | 'target_slo'>) => axios.post<IResponse<ISLO>>(this._api, data);
}

export default SLOService;
