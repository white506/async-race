import { useCallback } from 'react';
import { useCarsStore, useWinnersStore } from '../store';

export default function useRace() {
  const cars = useCarsStore((state) => state.cars);
  const startCarEngine = useCarsStore((state) => state.startCarEngine);
  const carStates = useCarsStore((state) => state.carStates);
  const driveCar = useCarsStore((state) => state.driveCar);
  const setCarState = useCarsStore((state) => state.setCarState);

  const saveWinner = useWinnersStore((state) => state.saveWinner);

  const startRace = useCallback(async () => {
    const racePromises = cars.map(async (car: { id: number }) => {
      try {
        const { velocity, distance } = await startCarEngine(car.id);
        const predictedTime = distance / velocity / 1000;
        setCarState(car.id, {
          isRunning: true,
          isBroken: false,
          isFinished: false,
        });

        const track = document.getElementById(`track-${car.id}`);
        const carEl = document.getElementById(`car-${car.id}`);
        if (track && carEl) {
          const trackWidth = track.clientWidth;

          const startLinePercent = 0.05;
          const finishLinePercent = 0.9;
          const overshootPercent = 0.05;
          const usableWidth =
            trackWidth * (finishLinePercent - startLinePercent);
          const overshoot = trackWidth * overshootPercent * 0.3;
          const totalDistancePx = usableWidth - carEl.clientWidth + overshoot;

          carEl.style.transition = 'none';
          carEl.style.transform = 'translate3d(0, -50%, 0)';

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          carEl.offsetHeight;

          setTimeout(() => {
            if (carEl) {
              carEl.style.transition = `transform ${predictedTime}s linear`;
              carEl.style.transform = `translate3d(${Math.max(0, totalDistancePx)}px, -50%, 0)`;
            }
          }, 20);
        }

        let carBroken = false;

        const stopCarAtCurrentPosition = () => {
          if (!carEl) return;

          const computedStyle = window.getComputedStyle(carEl);
          const currentTransform = computedStyle.transform;
          let currentX = 0;

          if (currentTransform && currentTransform !== 'none') {
            const matrix = currentTransform.match(/^matrix\((.+)\)$/);
            if (matrix) {
              const values = matrix[1].split(', ');
              currentX = parseFloat(values[4]) || 0;
            }
          }

          carEl.style.transition = 'none';

          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          carEl.offsetHeight;
          carEl.style.transform = `translate3d(${currentX}px, -50%, 0)`;

          setTimeout(() => {
            if (carEl) {
              carEl.style.transition = 'transform 0.1s ease-in-out';
              carEl.style.transform = `translate3d(${currentX - 5}px, -50%, 0)`;
              setTimeout(() => {
                if (carEl) {
                  carEl.style.transform = `translate3d(${currentX}px, -50%, 0)`;
                }
              }, 100);
            }
          }, 10);

          carBroken = true;

          setCarState(car.id, {
            isRunning: false,
            isBroken: true,
            isFinished: false,
          });
        };

        const driveResultPromise = driveCar(car.id)
          .then((result) => {
            if (!result.success) {
              stopCarAtCurrentPosition();
            }
            return result;
          })
          .catch(() => {
            stopCarAtCurrentPosition();
            return { success: false };
          });

        return new Promise<{ id: number; time: number; success: boolean }>(
          (resolve) => {
            const timeout = setTimeout(async () => {
              const driveResult = await driveResultPromise;
              const state = carStates[car.id];

              const success =
                !carBroken && driveResult.success && state && !state.isBroken;

              if (success) {
                setCarState(car.id, { isFinished: true, isRunning: false });
                resolve({ id: car.id, time: predictedTime, success: true });
              } else {
                resolve({ id: car.id, time: 0, success: false });
              }
              clearTimeout(timeout);
            }, predictedTime * 1000);
          },
        );
      } catch {
        return { id: car.id, time: 0, success: false };
      }
    });

    const results = await Promise.all(racePromises);

    const winners = results
      .filter((result: { success: boolean }) => result.success)
      .sort((a: { time: number }, b: { time: number }) => a.time - b.time);

    if (winners.length > 0) {
      const winner = winners[0];
      await saveWinner(winner.id, winner.time);
      return winner;
    }

    return null;
  }, [cars, startCarEngine, carStates, saveWinner, driveCar, setCarState]);

  return { startRace };
}
