import { useEffect, useState } from "react";
import { ISLO } from "../interfaces/ISLO";
import SLOService from "../services/service.slo";

const _sloService = new SLOService();

const useGetAllSLOs = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [SLOs, setSLOs] = useState<ISLO[]>([])

  const getSLOs = async () => {
    setLoading(true);
      setError(null);

      try {
        const response = await _sloService.all();
        setSLOs(response.data.data);
      } catch (err) {
        setError('Error while getting SLOs. Please try again');
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    (async() => {
      await getSLOs();
    })()
  }, []);

  return {
    loading,
    error,
    SLOs,
    refreshSLOs: getSLOs,
  }
}

export default useGetAllSLOs;
