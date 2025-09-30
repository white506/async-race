import { useRef, useCallback } from 'react';
import { EngineStatus } from '@api/engine';

interface UseCarAnimationProps {
  onStatusChange: (
    isRunning: boolean,
    isBroken: boolean,
    isFinished: boolean,
  ) => void;
  startCarEngine: () => Promise<{ velocity: number; distance: number }>;
  stopCarEngine: () => Promise<EngineStatus>;
  driveCar: () => Promise<{ success: boolean }>;
}

export function useCarAnimation({
  onStatusChange,
  startCarEngine,
  stopCarEngine,
  driveCar,
}: UseCarAnimationProps) {
  const carElementRef = useRef<HTMLElement | null>(null);
  const trackElementRef = useRef<HTMLElement | null>(null);

  const setCarElement = useCallback((element: HTMLElement | null) => {
    carElementRef.current = element;
  }, []);

  const setTrackElement = useCallback((element: HTMLElement | null) => {
    trackElementRef.current = element;
  }, []);

  const resetAnimation = useCallback(() => {
    onStatusChange(false, false, false);

    if (carElementRef.current) {
      carElementRef.current.style.transition = 'transform 0.7s ease-in-out';
      carElementRef.current.style.transform = 'translate3d(0, -50%, 0)';
    }
  }, [onStatusChange]);

  const handleBrokenAnimation = useCallback(
    (currentOffset: number) => {
      if (!carElementRef.current || !trackElementRef.current) return;

      const carElement = carElementRef.current;
      carElement.style.transition = 'none';
      carElement.style.transform = `translate3d(${currentOffset}px, -50%, 0)`;

      const ryvki = [
        { offset: currentOffset + 3, time: 0.1 },
        { offset: currentOffset - 2, time: 0.15 },
        { offset: currentOffset + 4, time: 0.12 },
        { offset: currentOffset - 3, time: 0.18 },
        { offset: Math.max(0, currentOffset - 5), time: 0.2 },
      ];

      ryvki.reduce((delay, { offset, time }) => {
        setTimeout(() => {
          if (carElement) {
            carElement.style.transition = `transform ${time}s cubic-bezier(0.36, 0.07, 0.19, 0.97)`;
            carElement.style.transform = `translate3d(${offset}px, -50%, 0)`;
          }
        }, delay * 1000);
        return delay + time;
      }, 0.05);

      setTimeout(() => {
        onStatusChange(false, true, false);
      }, 100);
    },
    [onStatusChange],
  );

  const startAnimation = useCallback(async () => {
    if (!trackElementRef.current || !carElementRef.current) return;

    try {
      onStatusChange(false, false, false);
      const { velocity, distance } = await startCarEngine();
      onStatusChange(true, false, false);

      const trackElement = trackElementRef.current;
      const carElement = carElementRef.current;

      const trackWidth = trackElement.clientWidth;
      const carWidth = carElement.clientWidth;

      const finishLinePosition = trackWidth * 0.9;
      const finishPosition = finishLinePosition + carWidth / 2;
      const duration = distance / velocity / 1000;
      const afterFinishPosition = finishPosition + 30;

      carElement.style.transition = 'none';
      carElement.style.transform = 'translate3d(0, -50%, 0)';

      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      carElement.offsetWidth;

      carElement.style.transition = `transform ${duration}s ease`;
      carElement.style.transform = `translate3d(${afterFinishPosition}px, -50%, 0)`;

      try {
        const { success } = await driveCar();

        if (success) {
          setTimeout(
            () => {
              onStatusChange(true, false, true);
            },
            duration * 1000 * 0.9,
          );

          setTimeout(
            () => {
              if (carElement) {
                carElement.style.transition = `transform ${duration * 0.15}s cubic-bezier(0.25, 1, 0.5, 1)`;
                carElement.style.transform = `translate3d(${afterFinishPosition + 5}px, -50%, 0)`;

                setTimeout(
                  () => {
                    if (carElement) {
                      carElement.style.transition =
                        'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
                      carElement.style.transform = `translate3d(${afterFinishPosition}px, -50%, 0)`;
                    }
                  },
                  duration * 0.15 * 1000,
                );
              }
            },
            duration * 0.85 * 1000,
          );
        }

        if (!success) {
          const carRect = carElement.getBoundingClientRect();
          const trackRect = trackElement.getBoundingClientRect();
          const currentOffset = carRect.left - trackRect.left;

          handleBrokenAnimation(currentOffset);
        }
      } catch {
        const carRect = carElement.getBoundingClientRect();
        const trackRect = trackElement.getBoundingClientRect();
        const currentOffset = carRect.left - trackRect.left;
        const finalOffset = Math.max(0, currentOffset - 5);

        carElement.style.transition = 'none';
        carElement.style.transform = `translate3d(${currentOffset}px, -50%, 0)`;

        setTimeout(() => {
          if (carElement) {
            carElement.style.transition = 'transform 0.1s ease-out';
            carElement.style.transform = `translate3d(${finalOffset}px, -50%, 0)`;
          }
        }, 50);

        onStatusChange(false, true, false);
      }
    } catch {
      onStatusChange(false, false, false);
    }
  }, [onStatusChange, handleBrokenAnimation, startCarEngine, driveCar]);

  const stopAnimation = useCallback(async () => {
    try {
      await stopCarEngine();
      resetAnimation();
    } catch {
      // Ignore errors when stopping
    }
  }, [resetAnimation, stopCarEngine]);

  return {
    startAnimation,
    stopAnimation,
    setCarElement,
    setTrackElement,
  };
}

export default useCarAnimation;
