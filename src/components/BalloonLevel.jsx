import { useEffect, useState } from 'react';
import { createBalloonSet } from '../data/gameData';

function BalloonLevel({ poppedCount, target, onPop }) {
  const [balloons, setBalloons] = useState(() => createBalloonSet());

  useEffect(() => {
    setBalloons(createBalloonSet());
  }, []);

  const handlePop = (id) => {
    setBalloons((current) => current.filter((balloon) => balloon.id !== id));
    onPop();
  };

  return (
    <div className="level-board balloon-board">
      <div className="board-header">
        <span className="board-badge">Level 1</span>
        <h2>Pop the floating balloons before they drift away.</h2>
      </div>

      <div className="balloon-field">
        {balloons.map((balloon) => (
          <button
            key={balloon.id}
            className={`balloon balloon-${balloon.color}`}
            style={{
              left: balloon.left,
              top: balloon.top,
              animationDelay: balloon.delay,
            }}
            onClick={() => handlePop(balloon.id)}
          >
            <span>{balloon.label}</span>
          </button>
        ))}
      </div>

      <p className="board-footer">
        Popped {poppedCount} of {target} balloons
      </p>
    </div>
  );
}

export default BalloonLevel;
