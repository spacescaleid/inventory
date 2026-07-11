import { useEffect, useState } from "react";

/**
 * Hook untuk detect apakah component sudah mounted di client.
 * Berguna untuk skip SSR pada content yang berbeda antara server & client.
 *
 * @example
 * const isMounted = useIsMounted();
 * if (!isMounted) return null; // atau <Skeleton />
 * return <div>{new Date().toLocaleString()}</div>;
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}