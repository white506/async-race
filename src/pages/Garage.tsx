import { useState, useEffect } from 'react';
import { getCars, createCar, updateCar, deleteCar, Car } from '@api/cars';
import CarForm from '@components/CarForm';
import CarRow from '@components/CarRow';
import '../styles/Garage.scss';

function Garage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);

  useEffect(() => {
    async function fetchCars() {
      const data = await getCars(page, 7);
      setCars(data);
      const response = await fetch('http://localhost:3000/garage');
      const allCars = await response.json();
      setTotal(allCars.length);
    }
    fetchCars();
  }, [page]);

  const handleCreateOrUpdate = async (
    name: string,
    color: string,
    id?: number,
  ) => {
    if (id) {
      const updatedCar = await updateCar(id, name, color);
      setCars((prevCars) =>
        prevCars.map((car) => (car.id === id ? updatedCar : car)),
      );
    } else {
      await createCar(name, color);
      const updatedCars = await getCars(page, 7);
      setCars(updatedCars);
      setTotal((prevTotal) => prevTotal + 1);
    }
    setSelectedCar(null);
  };

  const handleDelete = async (id: number) => {
    await deleteCar(id);
    setCars(cars.filter((car) => car.id !== id));
    setTotal((prevTotal) => prevTotal - 1);
  };

  const handleSelect = (car: Car) => {
    setSelectedCar(car);
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
      </div>
      <div>
        {cars.length === 0 ? (
          <p>No Cars</p>
        ) : (
          cars.map((car) => (
            <CarRow
              key={car.id}
              car={car}
              onSelect={() => handleSelect(car)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
      <div className="garage__footer">
        <h3>Garage ({total})</h3>

        <div className="garage__pagination">
          <button
            className="btn-16"
            type="button"
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span>Page {page}</span>
          <button
            className="btn-16"
            type="button"
            onClick={() =>
              setPage((p) => (p < Math.ceil(total / 7) ? p + 1 : p))
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
