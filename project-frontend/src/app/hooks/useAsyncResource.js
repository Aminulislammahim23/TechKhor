import { useCallback, useEffect, useRef, useState } from "react";
import { normalizeApiError } from "../services";

const defaultSelect = (value) => value;

export function useAsyncResource(loader, options = {}) {
  const { enabled = true, initialData = null, select = defaultSelect } = options;
  const initialDataRef = useRef(initialData);
  const selectRef = useRef(select);
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(Boolean(enabled));
  const [error, setError] = useState("");

  selectRef.current = select;

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await loader();
      const nextData = selectRef.current(response?.data ?? response);
      setData(nextData);
      return nextData;
    } catch (err) {
      const message = normalizeApiError(err);
      setError(message);
      setData(initialDataRef.current);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");
        const response = await loader();

        if (active) {
          setData(selectRef.current(response?.data ?? response));
        }
      } catch (err) {
        if (active) {
          setError(normalizeApiError(err));
          setData(initialDataRef.current);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, [enabled, loader]);

  return { data, setData, loading, error, setError, refetch: execute };
}
