import { useState, useRef, useEffect } from 'react';

export function useSafeState(...props) {
  const [state, setState] = useState(...props);
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);
  const safeSetState = (...args) => mountedRef.current && setState(...args);
  return [state, safeSetState];
}
