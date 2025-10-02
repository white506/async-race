import { useEffect, memo } from 'react';
import '@styles/Car.scss';
import CarControls from './CarControls';
import Track from './Track';
import CarVisual from './CarVisual';
import { useCarAnimation, useCarState, useCarActions } from '../hooks';

interface CarProps {
  id: number;
  name: string;
  color: string;
  isRaceInProgress?: boolean;
  onSelect?: () => void;
  onDelete?: () => void;
}

function CarComponent({
  id,
  name,
  color,
  isRaceInProgress = false,
  onSelect,
  onDelete,
}: CarProps) {
  const { isRunning, isBroken, isFinished } = useCarState(id);
  const { setCarState, startCarEngine, stopCarEngine, driveCar } =
    useCarActions(id);

  const handleStatusChange = (
    running: boolean,
    broken: boolean,
    finished: boolean,
  ) => {
    setCarState({
      isRunning: running,
      isBroken: broken,
      isFinished: finished,
    });
  };

  const { startAnimation, stopAnimation, setCarElement, setTrackElement } =
    useCarAnimation({
      onStatusChange: handleStatusChange,
      startCarEngine,
      stopCarEngine,
      driveCar,
    });

  useEffect(() => {
    const trackElement = document.getElementById(`track-${id}`);
    const carElement = document.getElementById(`car-${id}`);

    if (trackElement) setTrackElement(trackElement as HTMLElement);
    if (carElement) setCarElement(carElement as HTMLElement);
  }, [id, setCarElement, setTrackElement]);

  return (
    <div className="garage__car-row">
      <CarControls
        isRunning={isRunning}
        isBroken={isBroken}
        isFinished={isFinished}
        isRaceInProgress={isRaceInProgress}
        onStart={startAnimation}
        onStop={stopAnimation}
        onSelect={onSelect}
        onDelete={onDelete}
      />
      <Track id={id} name={name}>
        <CarVisual
          id={id}
          color={color}
          isRunning={isRunning}
          isBroken={isBroken}
          isFinished={isFinished}
        />
      </Track>
    </div>
  );
}

export default memo(CarComponent);
