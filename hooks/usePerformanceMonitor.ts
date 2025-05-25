import { useEffect, useRef } from 'react';

export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current += 1;
    const currentTime = performance.now();
    const renderTime = currentTime - lastRenderTime.current;

    console.debug(
      `[Performance] ${componentName}:\n`,
      `Render count: ${renderCount.current}\n`,
      `Render time: ${renderTime.toFixed(2)}ms`
    );

    lastRenderTime.current = currentTime;
  });
};