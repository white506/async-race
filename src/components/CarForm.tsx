import { useState, useEffect } from 'react';
import '../styles/CarForm.scss';
import '@styles/global.scss';

interface CarFormProps {
  onSubmit: (name: string, color: string, id?: number) => void;
  initialName?: string;
  initialColor?: string;
  selectedCarId?: number | null;
  isUpdate: boolean;
  isRaceInProgress?: boolean;
}

function CarForm({
  onSubmit,
  initialName = '',
  initialColor = '#000000',
  selectedCarId = null,
  isUpdate,
  isRaceInProgress = false,
}: CarFormProps) {
  const [name, setName] = useState(initialName);
  const [color, setColor] = useState(initialColor);
  const [error, setError] = useState<string | null>(null);
  const MAX_NAME_LENGTH = 30;

  useEffect(() => {
    setName(initialName);
    setColor(initialColor);
    setError(null);
  }, [initialName, initialColor]);

  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setError('Name cannot be empty');
      return false;
    }

    if (value.length > MAX_NAME_LENGTH) {
      setError(`Name must be ${MAX_NAME_LENGTH} characters or less`);
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateName(name)) {
      return;
    }

    onSubmit(name.trim(), color, selectedCarId || undefined);
    setName('');
    setColor('#000000');
  };

  return (
    <form className="garage__form" onSubmit={handleSubmit}>
      <div className="garage__form-input-wrapper">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            validateName(e.target.value);
          }}
          placeholder="Car Name"
          maxLength={MAX_NAME_LENGTH}
          required
          disabled={isRaceInProgress}
        />
        {error && <div className="garage__form-error">{error}</div>}
      </div>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        disabled={isRaceInProgress}
      />
      <button
        type="submit"
        className="button--primary"
        disabled={!!error || isRaceInProgress}
      >
        {isUpdate ? 'Update' : 'Save'}
      </button>
    </form>
  );
}

export default CarForm;
