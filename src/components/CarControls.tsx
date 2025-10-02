import { useCallback, memo } from 'react';
import '../styles/CarControls.scss';
import '@styles/global.scss';

interface CarControlsProps {
  isRunning: boolean;
  isBroken: boolean;
  isFinished: boolean;
  isRaceInProgress: boolean;
  onStart: () => void;
  onStop: () => void;
  onSelect?: () => void;
  onDelete?: () => void;
}

function CarControlsComponent({
  isRunning,
  isBroken,
  isFinished,
  isRaceInProgress,
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
    <div className="garage__car-controls">
      <div
        className={`garage__car-controls-status
        ${isRunning ? 'garage__car-controls-status--running' : ''}
        ${isBroken ? 'garage__car-controls-status--broken' : ''}
        ${isFinished ? 'garage__car-controls-status--finished' : ''}`}
      >
        {getEngineStatus()}
      </div>

      <div className="garage__car-controls-container">
        <div className="garage__car-controls-column">
          <button
            type="button"
            className="button--primary garage__car-controls-btn"
            onClick={onSelect}
            disabled={isRaceInProgress || isRunning}
            title={
              isRaceInProgress ? 'Not available during race' : 'Select car'
            }
          >
            select
          </button>
          <button
            type="button"
            className="button--primary garage__car-controls-btn"
            onClick={onDelete}
            disabled={isRaceInProgress || isRunning}
            title={
              isRaceInProgress ? 'Not available during race' : 'Remove car'
            }
          >
            remove
          </button>
        </div>

        <div className="garage__car-controls-column">
          <button
            type="button"
            className="button--primary garage__car-controls-btn"
            onClick={onStart}
            disabled={isRunning}
            title="Start engine"
          >
            A
          </button>
          <button
            type="button"
            className="button--primary garage__car-controls-btn"
            onClick={onStop}
            disabled={!isRunning}
            title="Stop engine"
          >
            B
          </button>
        </div>
      </div>
    </div>
  );
}

const CarControls = memo(CarControlsComponent);

export default CarControls;
