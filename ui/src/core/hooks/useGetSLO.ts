import { useEffect, useState } from "react";
import { ISLO } from "../interfaces/ISLO";
import SLOService from "../services/service.slo";

const _sloService = new SLOService();

const useGetSLO = (activeSLO: ISLO | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [SLO, setSLO] = useState<ISLO | null>(activeSLO);

  const getSLO = async () => {
    if (!activeSLO) return;

    setLoading(true);
    setError(null);

    try {
      const response = await _sloService.get(activeSLO.id);
      setSLO(response.data.data);
    } catch (err) {
      console.log(err)
      setError('Error while getting SLO. Please try again');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async() => {
      await getSLO();
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSLO]);

  return {
    SLO,
    SLOLoading: loading,
    SLOError: error,
    refreshSLO: getSLO,
  }
}

export default useGetSLO;
