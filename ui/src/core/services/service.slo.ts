import axios from "axios";
import { API } from ".";
import { IResponse } from "../interfaces/IResponse";
import { ISLO } from "../interfaces/ISLO";

class SLOService {
  private _api = `${API}/api/v1/slo`;

  all = () => axios.get<IResponse<ISLO[]>>(this._api);
}

export default SLOService;
