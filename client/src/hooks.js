import { useState, useEffect, useRef } from "react";

export function useDebounce(val, delay = 400) {
  const [dv, setDv] = useState(val);
  useEffect(() => { const t = setTimeout(() => setDv(val), delay); return () => clearTimeout(t); }, [val, delay]);
  return dv;
}

export function usePrevious(val) {
  const ref = useRef();
  useEffect(() => { ref.current = val; });
  return ref.current;
}

export function useOnClickOutside(ref, cb) {
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) cb(e); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [ref, cb]);
}

export function useThrottle(val, ms = 300) {
  const [tv, setTv] = useState(val);
  const last = useRef(Date.now());
  useEffect(() => {
    const h = setTimeout(() => {
      if (Date.now() - last.current >= ms) { setTv(val); last.current = Date.now(); }
    }, ms - (Date.now() - last.current));
    return () => clearTimeout(h);
  }, [val, ms]);
  return tv;
}

export function useFetch(mockData, delay = 1000) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    const t = setTimeout(() => {
      if (!cancelled) setState({ data: mockData, loading: false, error: null });
    }, delay);
    return () => { cancelled = true; clearTimeout(t); };
  }, [delay]);
  return state;
}
