import { useCallback } from 'react';
import { useCarsStore, useWinnersStore } from '../store';

export default function useRace() {
  const cars = useCarsStore((state) => state.cars);
  const startCarEngine = useCarsStore((state) => state.startCarEngine);
  const carStates = useCarsStore((state) => state.carStates);

  const saveWinner = useWinnersStore((state) => state.saveWinner);

  const startRace = useCallback(async () => {
    const racePromises = cars.map(async (car: { id: number }) => {
      try {
        const { velocity, distance } = await startCarEngine(car.id);

        const time = distance / velocity / 1000;

        return new Promise<{ id: number; time: number; success: boolean }>(
          (resolve) => {
            const timeout = setTimeout(() => {
              const state = carStates[car.id];

              if (state && !state.isBroken) {
                resolve({ id: car.id, time, success: true });
              } else {
                resolve({ id: car.id, time: 0, success: false });
              }

              clearTimeout(timeout);
            }, time * 1000);
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
  }, [cars, startCarEngine, carStates, saveWinner]);

  return { startRace };
}
