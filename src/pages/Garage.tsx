import { useEffect, useState } from 'react';
import { Car } from '@api/cars';
import CarForm from '@components/CarForm';
import CarComponent from '@components/Car';
import '../styles/Garage.scss';
import '../styles/global.scss';
import RaceControls from '@components/RaceControls';
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
    const currentPage = page;
    const currentCarsOnPage = cars.length;

    await removeCar(id);

    if (currentCarsOnPage === 1) {
      if (currentPage > 1) {
        setPage(currentPage - 1);
      } else {
        fetchCars(1, 7);
      }
    } else {
      fetchCars(currentPage, 7);
    }
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

      const el = document.getElementById(`car-${car.id}`);
      if (el) {
        el.style.transition = 'transform 0.25s ease-in-out';
        el.style.transform = 'translate3d(0, -50%, 0)';
      }
    });

    setWinner(null);
  };

  const generateRandomCars = async () => {
    const carModels: Record<string, string[]> = {
      Tesla: ['Model S', 'Model 3', 'Model X', 'Model Y', 'Cybertruck'],
      BMW: ['X5', 'X3', 'M3', '5 Series', '7 Series'],
      Mercedes: ['C-Class', 'E-Class', 'S-Class', 'GLE', 'G-Wagon'],
      Audi: ['A4', 'A6', 'Q5', 'Q7', 'e-tron'],
      Toyota: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Prius'],
      Honda: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Odyssey'],
      Ford: ['Mustang', 'F-150', 'Explorer', 'Escape', 'Focus'],
      Nissan: ['Altima', 'Rogue', 'Sentra', 'Pathfinder', 'Leaf'],
      Porsche: ['911', 'Cayenne', 'Panamera', 'Taycan', 'Macan'],
      Lamborghini: ['Aventador', 'Huracan', 'Urus', 'Gallardo', 'Countach'],
    };

    const carBrands = Object.keys(carModels);

    const getRandomColor = () => {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i += 1) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const getRandomName = () => {
      const brand = carBrands[Math.floor(Math.random() * carBrands.length)];

      const brandModels = carModels[brand];
      const model = brandModels[Math.floor(Math.random() * brandModels.length)];
      return `${brand} ${model}`;
    };

    const promises = [];
    for (let i = 0; i < 100; i += 1) {
      const name = getRandomName();
      const color = getRandomColor();
      promises.push(createOrUpdateCar(name, color));
    }

    try {
      await Promise.all(promises);

      setPage(1);
      fetchCars(1, 7);
    } catch {
      // Error generating cars
    }
  };

  return (
    <div className="garage">
      <div className="garage__controls">
        <div className="garage__controls-left">
          <RaceControls
            isRacing={isRacing}
            hasCars={cars.length > 0}
            winner={winner}
            onStart={handleStartRace}
            onReset={handleResetRace}
            onCloseWinner={() => setWinner(null)}
          />
        </div>
        <div className="garage__controls-center">
          <CarForm
            onSubmit={handleCreateOrUpdate}
            initialName={selectedCar?.name || ''}
            initialColor={selectedCar?.color || '#000000'}
            selectedCarId={selectedCar?.id || null}
            isUpdate={!!selectedCar}
            isRaceInProgress={isRacing}
          />
        </div>
        <div className="garage__controls-right">
          <div className="garage__generate-button">
            <button
              type="button"
              className="button--generate"
              disabled={isRacing}
              onClick={generateRandomCars}
            >
              Generate Cars
            </button>
          </div>
        </div>
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
              isRaceInProgress={isRacing}
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
            disabled={page === 1 || isRacing}
            title={isRacing ? 'Not available during race' : 'Previous page'}
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
            disabled={page >= Math.ceil(total / 7) || isRacing}
            title={isRacing ? 'Not available during race' : 'Next page'}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Garage;
