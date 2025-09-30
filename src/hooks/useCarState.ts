import { useMemo } from 'react';
import { startEngine, stopEngine, driveCar } from '@api/engine';
import { useCarsStore } from '../store/carsStore';

export interface CarState {
  isRunning: boolean;
  isBroken: boolean;
  isFinished: boolean;
}

export const useCarState = (id: number): CarState => {
  const carState = useCarsStore((state) => state.carStates[id]);

  const fallback = useMemo<CarState>(
    () => ({ isRunning: false, isBroken: false, isFinished: false }),
    [],
  );

  return carState || fallback;
};

export const useCarActions = (id: number) => {
  const setCarState = useCarsStore((state) => state.setCarState);

  return {
    setCarState: (state: Partial<CarState>) => setCarState(id, state),
    startCarEngine: () => startEngine(id),
    stopCarEngine: () => stopEngine(id),
    driveCar: () => driveCar(id),
  };
};
