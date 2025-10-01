import { memo } from 'react';
import '@styles/global.scss';
import '../styles/Garage.scss';

interface RaceControlsProps {
  isRacing: boolean;
  hasCars: boolean;
  winner: { id: number; time: number; name: string } | null;
  onStart: () => void;
  onReset: () => void;
  onCloseWinner: () => void;
}

function RaceControlsComponent({
  isRacing,
  hasCars,
  winner,
  onStart,
  onReset,
  onCloseWinner,
}: RaceControlsProps) {
  return (
    <div className="garage__race-controls-wrapper">
      <div className="garage__race-controls">
        <button
          type="button"
          className="button--race"
          disabled={isRacing || !hasCars}
          onClick={onStart}
        >
          Race
        </button>
        <button
          type="button"
          className="button--reset"
          disabled={isRacing}
          onClick={onReset}
        >
          Reset
        </button>
      </div>
      {winner && (
        <div className="garage__winner-modal">
          <div className="garage__winner-modal-content">
            <h3>🏆 Winner!</h3>
            <p>
              {winner.name} wins with time: {winner.time.toFixed(2)}s
            </p>
            <button
              type="button"
              className="button--primary"
              onClick={onCloseWinner}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default memo(RaceControlsComponent);
