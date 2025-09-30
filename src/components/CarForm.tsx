import { useState, useEffect } from 'react';
import '../styles/CarForm.scss';
import '@styles/global.scss';

interface CarFormProps {
  onSubmit: (name: string, color: string, id?: number) => void;
  initialName?: string;
  initialColor?: string;
  selectedCarId?: number | null;
  isUpdate: boolean;
}

function CarForm({
  onSubmit,
  initialName = '',
  initialColor = '#000000',
  selectedCarId = null,
  isUpdate,
}: CarFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    setName(initialName);
    setColor(initialColor);
  }, [initialName, initialColor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(name, color, selectedCarId || undefined);
    setName('');
    setColor('#000000');
  };

  return (
    <form className="garage__form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Car Name"
        required
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      />
      <button type="submit" className="button--primary">
        {isUpdate ? 'Update' : 'Save'}
      </button>
    </form>
  );
}

export default CarForm;
