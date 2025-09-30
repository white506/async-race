import { useMemo } from 'react';
import { Car } from '@api/cars';
import { Winner } from '@api/winners';
import { useCarsStore, useWinnersStore, SortBy, SortOrder } from '../store';

type CarsState = {
  cars: Car[];
  page: number;
  total: number;
  selectedCar: Car | null;
  carStates: Record<
    number,
    { isRunning: boolean; isBroken: boolean; isFinished: boolean }
  >;
  loading: boolean;

  setPage: (page: number) => void;
  setCars: (cars: Car[]) => void;
  setTotal: (total: number) => void;
  selectCar: (car: Car | null) => void;
  fetchCars: (page: number, limit: number) => Promise<void>;
  createOrUpdateCar: (
    name: string,
    color: string,
    id?: number,
  ) => Promise<void>;
  removeCar: (id: number) => Promise<void>;
  setCarState: (
    id: number,
    state: { isRunning?: boolean; isBroken?: boolean; isFinished?: boolean },
  ) => void;
  startCarEngine: (
    id: number,
  ) => Promise<{ velocity: number; distance: number }>;
  stopCarEngine: (id: number) => Promise<void>;
  driveCar: (id: number) => Promise<{ success: boolean }>;
};

type WinnersState = {
  winners: Winner[];
  page: number;
  total: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
  loading: boolean;
  setPage: (page: number) => void;
  setSorting: (sortBy: SortBy, sortOrder: SortOrder) => void;
  fetchWinners: (
    page: number,
    limit: number,
    sortBy?: SortBy,
    sortOrder?: SortOrder,
  ) => Promise<void>;
  saveWinner: (id: number, time: number) => Promise<void>;
  removeWinner: (id: number) => Promise<void>;
};

const carsSelector = (state: CarsState) => state.cars;
const pageSelector = (state: CarsState) => state.page;
const totalSelector = (state: CarsState) => state.total;
const selectedCarSelector = (state: CarsState) => state.selectedCar;
const carStatesSelector = (state: CarsState) => state.carStates;
const loadingSelector = (state: CarsState) => state.loading;

export const useCars = () => useCarsStore(carsSelector);
export const usePage = () => useCarsStore(pageSelector);
export const useTotal = () => useCarsStore(totalSelector);
export const useSelectedCar = () => useCarsStore(selectedCarSelector);
export const useCarStates = () => useCarsStore(carStatesSelector);
export const useCarLoading = () => useCarsStore(loadingSelector);

export const useCarActions = () => {
  const setPage = useCarsStore((state) => state.setPage);
  const setCars = useCarsStore((state) => state.setCars);
  const setTotal = useCarsStore((state) => state.setTotal);
  const selectCar = useCarsStore((state) => state.selectCar);
  const fetchCars = useCarsStore((state) => state.fetchCars);
  const createOrUpdateCar = useCarsStore((state) => state.createOrUpdateCar);
  const removeCar = useCarsStore((state) => state.removeCar);
  const setCarState = useCarsStore((state) => state.setCarState);
  const startCarEngine = useCarsStore((state) => state.startCarEngine);
  const stopCarEngine = useCarsStore((state) => state.stopCarEngine);
  const driveCar = useCarsStore((state) => state.driveCar);

  return useMemo(
    () => ({
      setPage,
      setCars,
      setTotal,
      selectCar,
      fetchCars,
      createOrUpdateCar,
      removeCar,
      setCarState,
      startCarEngine,
      stopCarEngine,
      driveCar,
    }),
    [
      setPage,
      setCars,
      setTotal,
      selectCar,
      fetchCars,
      createOrUpdateCar,
      removeCar,
      setCarState,
      startCarEngine,
      stopCarEngine,
      driveCar,
    ],
  );
};

const winnersSelector = (state: WinnersState) => state.winners;
const winnersPageSelector = (state: WinnersState) => state.page;
const winnersTotalSelector = (state: WinnersState) => state.total;
const sortBySelector = (state: WinnersState) => state.sortBy;
const sortOrderSelector = (state: WinnersState) => state.sortOrder;

export const useWinners = () => useWinnersStore(winnersSelector);
export const useWinnersPage = () => useWinnersStore(winnersPageSelector);
export const useWinnersTotal = () => useWinnersStore(winnersTotalSelector);
export const useSortBy = () => useWinnersStore(sortBySelector);
export const useSortOrder = () => useWinnersStore(sortOrderSelector);

export const useWinnerActions = () => {
  const setPage = useWinnersStore((state) => state.setPage);
  const setSorting = useWinnersStore((state) => state.setSorting);
  const fetchWinners = useWinnersStore((state) => state.fetchWinners);
  const saveWinner = useWinnersStore((state) => state.saveWinner);
  const removeWinner = useWinnersStore((state) => state.removeWinner);

  return useMemo(
    () => ({
      setPage,
      setSorting,
      fetchWinners,
      saveWinner,
      removeWinner,
    }),
    [setPage, setSorting, fetchWinners, saveWinner, removeWinner],
  );
};
