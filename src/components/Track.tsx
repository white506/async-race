import { ReactNode, memo } from 'react';
import '../styles/Track.scss';

interface TrackProps {
  id: number;
  name: string;
  children: ReactNode;
}

function TrackComponent({ id, name, children }: TrackProps) {
  return (
    <div id={`track-${id}`} className="track">
      <div className="track__start-line" />
      <div className="track__finish-line" />
      <div className="track__safety-strip-top" />
      <div className="track__safety-strip-bottom" />
      <div className="track__lanes" />
      <div className="track__decoration track__distance-marker track__distance-marker--start" />
      <div className="track__decoration track__distance-marker track__distance-marker--middle" />
      <div className="track__decoration track__distance-marker track__distance-marker--finish" />
      <div className="track__car-container">{children}</div>
      <div className="track__car-name" title={name}>
        {name}
      </div>
    </div>
  );
}

const Track = memo(TrackComponent);

export default Track;
