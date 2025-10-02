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
  const brokenAnimFrame = useRef<number | null>(null);
  const brokenStartTime = useRef<number | null>(null);
  const brokenSequenceIndex = useRef(0);
  const brokenStartOffset = useRef(0);

  const setCarElement = useCallback((element: HTMLElement | null) => {
    carElementRef.current = element;
  }, []);

  const setTrackElement = useCallback((element: HTMLElement | null) => {
    trackElementRef.current = element;
  }, []);

  const disableWillChange = useCallback(() => {
    if (carElementRef.current) carElementRef.current.style.willChange = '';
  }, []);

  const enableWillChange = useCallback(() => {
    if (carElementRef.current)
      carElementRef.current.style.willChange = 'transform';
  }, []);

  const resetAnimation = useCallback(() => {
    onStatusChange(false, false, false);

    if (carElementRef.current) {
      disableWillChange();
      carElementRef.current.style.transition = 'transform 0.7s ease-in-out';
      carElementRef.current.style.transform = 'translate3d(0, -50%, 0)';
    }
    if (brokenAnimFrame.current) {
      cancelAnimationFrame(brokenAnimFrame.current);
      brokenAnimFrame.current = null;
    }
    brokenStartTime.current = null;
    brokenSequenceIndex.current = 0;
  }, [onStatusChange, disableWillChange]);

  const handleBrokenAnimation = useCallback(
    (currentOffset: number) => {
      if (!carElementRef.current) return;
      const carElement = carElementRef.current;

      enableWillChange();
      carElement.style.transition = 'none';
      carElement.style.transform = `translate3d(${currentOffset}px, -50%, 0)`;

      const sequence = [
        { offset: 3, duration: 100 },
        { offset: -2, duration: 150 },
        { offset: 4, duration: 120 },
        { offset: -3, duration: 180 },
        { offset: -5, duration: 200 },
      ];

      brokenStartOffset.current = currentOffset;
      brokenSequenceIndex.current = 0;
      brokenStartTime.current = null;

      const step = (timestamp: number) => {
        if (!carElementRef.current) return;
        if (brokenStartTime.current === null)
          brokenStartTime.current = timestamp;

        const idx = brokenSequenceIndex.current;
        if (idx >= sequence.length) {
          onStatusChange(false, true, false);
          disableWillChange();
          brokenAnimFrame.current = null;
          return;
        }

        const seg = sequence[idx];
        const elapsed = timestamp - (brokenStartTime.current ?? 0);
        const segStart = sequence
          .slice(0, idx)
          .reduce((a, s) => a + s.duration, 0);
        const segEnd = segStart + seg.duration;

        if (elapsed >= segStart) {
          const progress = Math.min(1, (elapsed - segStart) / seg.duration);
          const base = brokenStartOffset.current;
          const cumulativePrev = sequence
            .slice(0, idx)
            .reduce((acc, s) => acc + s.offset, 0);
          const from = base + cumulativePrev;
          const to = from + seg.offset;
          const current = from + (to - from) * progress;
          carElement.style.transform = `translate3d(${current}px, -50%, 0)`;
        }

        if (elapsed >= segEnd) {
          brokenSequenceIndex.current += 1;
        }

        brokenAnimFrame.current = requestAnimationFrame(step);
      };

      brokenAnimFrame.current = requestAnimationFrame(step);
    },
    [onStatusChange, enableWillChange, disableWillChange],
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
      const duration = distance / velocity / 1000;

      const SAFE_PADDING_RIGHT = 8;
      const theoreticalFinish = trackWidth * 0.9 + carWidth / 2 + 30;
      const maxAllowed = Math.max(
        0,
        trackWidth - carWidth - SAFE_PADDING_RIGHT,
      );
      const afterFinishPosition = Math.min(theoreticalFinish, maxAllowed);

      enableWillChange();

      carElement.style.transition = 'none';
      carElement.style.transform = 'translate3d(0, -50%, 0)';

      // eslint-disable-next-line no-promise-executor-return
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
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

        requestAnimationFrame(() => {
          if (carElement) {
            carElement.style.transition = 'transform 0.1s ease-out';
            carElement.style.transform = `translate3d(${finalOffset}px, -50%, 0)`;
          }
        });

        onStatusChange(false, true, false);
      }
    } catch {
      onStatusChange(false, false, false);
    }
  }, [
    onStatusChange,
    handleBrokenAnimation,
    startCarEngine,
    driveCar,
    enableWillChange,
  ]);

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
