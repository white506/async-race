import { useCallback, memo } from 'react';
import '../styles/CarControls.scss';
import '@styles/global.scss';

interface CarControlsProps {
  isRunning: boolean;
  isBroken: boolean;
  isFinished: boolean;
  onStart: () => void;
  onStop: () => void;
  onSelect?: () => void;
  onDelete?: () => void;
}

function CarControlsComponent({
  isRunning,
  isBroken,
  isFinished,
  onStart,
  onStop,
  onSelect,
  onDelete,
}: CarControlsProps) {
  const getEngineStatus = useCallback(() => {
    if (isRunning) {
      return 'ENGINE ON';
    }
    if (isBroken) {
      return 'BROKEN';
    }
    if (isFinished) {
      return 'FINISHED';
    }
    return 'ENGINE OFF';
  }, [isRunning, isBroken, isFinished]);

  return (
    <div className="car-controls">
      <div
        className={`car-controls__status
        ${isRunning ? 'car-controls__status--running' : ''}
        ${isBroken ? 'car-controls__status--broken' : ''}
        ${isFinished ? 'car-controls__status--finished' : ''}`}
      >
        {getEngineStatus()}
      </div>

      <div className="car-controls__container">
        <div className="car-controls__column">
          <button
            type="button"
            className="button--primary car-controls__btn"
            onClick={onSelect}
          >
            select
          </button>
          <button
            type="button"
            className="button--primary car-controls__btn"
            onClick={onDelete}
          >
            remove
          </button>
        </div>

        <div className="car-controls__column">
          <button
            type="button"
            className="button--primary car-controls__btn"
            onClick={onStart}
            disabled={isRunning}
            title="Start engine"
          >
            GO
          </button>
          <button
            type="button"
            className="button--primary car-controls__btn"
            onClick={onStop}
            disabled={!isRunning}
            title="Stop engine"
          >
            STOP
          </button>
        </div>
      </div>
    </div>
  );
}

const CarControls = memo(CarControlsComponent);

export default CarControls;
