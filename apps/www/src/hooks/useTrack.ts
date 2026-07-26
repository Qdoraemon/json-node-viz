import { useCallback } from "react";
import { track } from "../lib/track";

/**
 * React hook for tracking user click events.
 * Returns a stable callback that you can attach to onClick handlers.
 *
 * @example
 * const { trackClick } = useTrack();
 * <Button onClick={() => trackClick("format_json")}>Format</Button>
 */
export function useTrack() {
  const trackClick = useCallback(
    (feature: string, metadata?: Record<string, unknown>) => {
      track(feature, metadata);
    },
    [],
  );

  return { trackClick };
}
