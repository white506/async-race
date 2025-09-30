import { useEffect, useState } from 'react';
import { Car } from '@api/cars';
import CarForm from '@components/CarForm';
import CarComponent from '@components/Car';
import '../styles/Garage.scss';
import '../styles/global.scss';
import { useRace } from '../hooks';
import {
  useCars,
  usePage,
  useTotal,
  useSelectedCar,
  useCarActions,
} from '../hooks/useZustandStore';

function Garage() {
  const [winner, setWinner] = useState<{
    id: number;
    time: number;
    name: string;
  } | null>(null);
  const [isRacing, setIsRacing] = useState(false);

  const cars = useCars();
  const page = usePage();
  const total = useTotal();
  const selectedCar = useSelectedCar();

  const {
    setPage,
    fetchCars,
    createOrUpdateCar,
    removeCar,
    selectCar,
    stopCarEngine,
  } = useCarActions();

  const { startRace } = useRace();

  useEffect(() => {
    fetchCars(page, 7);
  }, [page, fetchCars]);

  const handleCreateOrUpdate = async (
    name: string,
    color: string,
    id?: number,
  ) => {
    await createOrUpdateCar(name, color, id);
  };

  const handleDelete = async (id: number) => {
    await removeCar(id);
  };

  const handleSelect = (car: Car) => {
    selectCar(car);
  };

  const handleStartRace = async () => {
    setIsRacing(true);
    try {
      const raceWinner = await startRace();

      if (raceWinner) {
        const winnerCar = cars.find((c: Car) => c.id === raceWinner.id);
        setWinner({
          id: raceWinner.id,
          time: raceWinner.time,
          name: winnerCar?.name || `Car #${raceWinner.id}`,
        });
      }
    } catch {
      // Error when starting the race
    } finally {
      setIsRacing(false);
    }
  };

  const handleResetRace = () => {
    cars.forEach((car: Car) => {
      stopCarEngine(car.id);
    });

    setWinner(null);
  };

  return (
    <div className="garage">
      <div className="garage__controls">
        <CarForm
          onSubmit={handleCreateOrUpdate}
          initialName={selectedCar?.name || ''}
          initialColor={selectedCar?.color || '#000000'}
          selectedCarId={selectedCar?.id || null}
          isUpdate={!!selectedCar}
        />
        <div className="garage__race-controls">
          <button
            type="button"
            className="button--race"
            disabled={isRacing || cars.length === 0}
            onClick={handleStartRace}
          >
            Race
          </button>
          <button
            type="button"
            className="button--reset"
            onClick={handleResetRace}
          >
            Reset
          </button>
        </div>
        {winner && (
          <div className="winner-modal">
            <div className="winner-modal__content">
              <h3>🏆 Winner!</h3>
              <p>
                {winner.name} wins with time: {winner.time.toFixed(2)}s
              </p>
              <button
                type="button"
                className="button--primary"
                onClick={() => setWinner(null)}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="garage__cars">
        {cars.length === 0 ? (
          <p>No Cars</p>
        ) : (
          cars.map((car: Car) => (
            <CarComponent
              key={car.id}
              id={car.id}
              name={car.name}
              color={car.color}
              onSelect={() => handleSelect(car)}
              onDelete={() => handleDelete(car.id)}
            />
          ))
        )}
      </div>
      <div className="garage__footer">
        <h3>Garage ({total})</h3>

        <div className="garage__pagination">
          <button
            className="button--primary"
            type="button"
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="garage__pagination--current">Page {page}</span>
          <button
            className="button--primary"
            type="button"
            onClick={() =>
              setPage(page < Math.ceil(total / 7) ? page + 1 : page)
            }
            disabled={page >= Math.ceil(total / 7)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Garage;
