import { useEffect, useState } from "react";
import { IIncident } from "../interfaces/IIncident";
import { ISLO } from "../interfaces/ISLO";
import IncidentService from "../services/service.incident";

const useGetSLIs = (slo: ISLO | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [SLIs, setSLIs] = useState<IIncident[]>([]);

  const getSLI = async() => {
    if(!slo) return;

    setLoading(true);
    setError(null);

    const _incidentService = new IncidentService(slo.id);

    try {
      const response = await _incidentService.get();
      setSLIs(response.data.data);
    } catch (err) {
      console.log(err);
      setError('Error while getting SLIs. Please try again');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getSLI();
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slo])

  return {
    SLIs,
    SLILoading: loading,
    SLIError: error,
    refreshSLIs: getSLI,
  }
}

export default useGetSLIs;
