import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  Car as CarType,
} from '@api/cars';
import { startEngine, stopEngine, driveCar } from '@api/engine';

interface CarState {
  isRunning: boolean;
  isBroken: boolean;
  isFinished: boolean;
}

interface CarsState {
  cars: CarType[];
  carStates: Record<number, CarState>;
  selectedCar: CarType | null;
  page: number;
  total: number;
  loading: boolean;

  setCars: (cars: CarType[]) => void;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setLoading: (loading: boolean) => void;

  selectCar: (car: CarType | null) => void;
  fetchCars: (page: number, limit: number) => Promise<void>;
  createOrUpdateCar: (
    name: string,
    color: string,
    id?: number,
  ) => Promise<void>;
  removeCar: (id: number) => Promise<void>;

  setCarState: (
    id: number,
    state: {
      isRunning?: boolean;
      isBroken?: boolean;
      isFinished?: boolean;
    },
  ) => void;

  startCarEngine: (
    id: number,
  ) => Promise<{ velocity: number; distance: number }>;
  stopCarEngine: (id: number) => Promise<void>;
  driveCar: (id: number) => Promise<{ success: boolean }>;
}

export const useCarsStore = create<CarsState>()(
  devtools(
    persist(
      (set, get) => ({
        cars: [],
        carStates: {},
        selectedCar: null,
        page: 1,
        total: 0,
        loading: false,

        setCars: (cars: CarType[]) => set({ cars }),
        setPage: (page: number) => set({ page }),
        setTotal: (total: number) => set({ total }),
        setLoading: (loading: boolean) => set({ loading }),

        selectCar: (car) => set({ selectedCar: car }),
        fetchCars: async (page, limit) => {
          const { setLoading, setCars, setTotal } = get();
          setLoading(true);
          try {
            const data = await getCars(page, limit);
            setCars(data);

            const response = await fetch('http://localhost:3000/garage');
            const allCars = await response.json();
            setTotal(allCars.length);
          } catch {
            // If there is an error loading vehicles
          } finally {
            setLoading(false);
          }
        },
        createOrUpdateCar: async (name, color, id) => {
          const { setLoading, setCars, fetchCars, setTotal, page, total } =
            get();
          setLoading(true);

          try {
            if (id) {
              const updatedCar = await updateCar(id, name, color);
              setCars(
                get().cars.map((car: CarType) =>
                  car.id === id ? updatedCar : car,
                ),
              );
            } else {
              await createCar(name, color);
              await fetchCars(page, 7);
              setTotal(total + 1);
            }
          } catch {
            // If there is an error creating or updating a vehicle
          } finally {
            setLoading(false);
            set({ selectedCar: null });
          }
        },
        removeCar: async (id) => {
          const { setLoading, setCars, cars, setTotal, total } = get();
          setLoading(true);

          try {
            await deleteCar(id);
            setCars(cars.filter((car) => car.id !== id));
            setTotal(total - 1);
          } catch {
            // If there is an error deleting the vehicle
          } finally {
            setLoading(false);
          }
        },

        setCarState: (id, state) => {
          set((prevState) => {
            const currentCarState = prevState.carStates[id] || {
              isRunning: false,
              isBroken: false,
              isFinished: false,
            };

            return {
              carStates: {
                ...prevState.carStates,
                [id]: {
                  ...currentCarState,
                  ...state,
                },
              },
            };
          });
        },

        startCarEngine: async (id) => {
          const { setCarState } = get();

          try {
            setCarState(id, {
              isRunning: false,
              isBroken: false,
              isFinished: false,
            });

            const result = await startEngine(id);

            setCarState(id, { isRunning: true });

            return result;
          } catch (error) {
            setCarState(id, { isRunning: false });
            throw error;
          }
        },
        stopCarEngine: async (id) => {
          const { setCarState } = get();

          await stopEngine(id);

          setCarState(id, {
            isRunning: false,
            isBroken: false,
            isFinished: false,
          });
        },
        driveCar: async (id) => {
          const { setCarState } = get();

          try {
            const result = await driveCar(id);

            if (!result.success) {
              setCarState(id, {
                isRunning: false,
                isBroken: true,
                isFinished: false,
              });
            }

            return result;
          } catch (error) {
            setCarState(id, {
              isRunning: false,
              isBroken: true,
              isFinished: false,
            });

            throw error;
          }
        },
      }),
      {
        name: 'cars-storage',

        partialize: (state) => ({
          cars: state.cars,
          carStates: state.carStates,
          page: state.page,
          total: state.total,
          selectedCar: state.selectedCar,
        }),
      },
    ),
  ),
);

export const selectCarState = (id: number) => (state: CarsState) =>
  state.carStates[id] || {
    isRunning: false,
    isBroken: false,
    isFinished: false,
  };
