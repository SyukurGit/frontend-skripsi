"use client";

import * as React from "react";

export function useNowMs(stepMs: number = 500) {
  const [now, setNow] = React.useState(0);

  React.useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const t = setInterval(tick, stepMs);
    return () => clearInterval(t);
  }, [stepMs]);

  return now;
}

export function useCountdown(targetEpochMs: number, stepMs: number = 500) {
  const now = useNowMs(stepMs);
  if (now <= 0 || targetEpochMs <= 0) return 0;
  return Math.max(0, targetEpochMs - now);
}
