import '../styles/CarRow.scss';

interface CarRowProps {
  car: { id: number; name: string; color: string };
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

function CarRow({ car, onSelect, onDelete }: CarRowProps) {
  return (
    <div className="garage__car-row">
      <span style={{ color: car.color }}>{car.name}</span>
      <div className="car-row__buttons">
        <button type="button" onClick={() => onSelect(car.id)}>
          Select
        </button>
        <button type="button" onClick={() => onDelete(car.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default CarRow;
