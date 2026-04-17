import { useEffect, useRef, useState } from 'react';
import { createFallingItem, levelOneTarget } from '../data/gameData';

function LevelOneGame({ onBack, onComplete }) {
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState('running');
  const spawnCountRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (status !== 'running') {
      return undefined;
    }

    const fallInterval = window.setInterval(() => {
      setItems((current) =>
        current
          .map((item) => ({ ...item, top: item.top + item.speed }))
          .filter((item) => item.top < 112),
      );
    }, 40);

    return () => window.clearInterval(fallInterval);
  }, [status]);

  useEffect(() => {
    if (status !== 'running') {
      return undefined;
    }

    const spawnInterval = window.setInterval(() => {
      spawnCountRef.current += 1;
      const nextItem = createFallingItem(spawnCountRef.current);
      setItems((current) => [...current, { ...nextItem, top: -18 }]);
    }, 900);

    return () => window.clearInterval(spawnInterval);
  }, [status]);

  const resetGame = () => {
    setItems([]);
    setScore(0);
    setStatus('running');
    spawnCountRef.current = 0;
    completedRef.current = false;
  };

  const handleItemClick = (clickedItem) => {
    if (status !== 'running') {
      return;
    }

    setItems((current) => current.filter((item) => item.id !== clickedItem.id));

    if (clickedItem.type === 'bomb') {
      setStatus('gameover');
      return;
    }

    setScore((current) => {
      const next = current + clickedItem.points;

      if (next >= levelOneTarget && !completedRef.current) {
        completedRef.current = true;
        setStatus('won');
        window.setTimeout(() => onComplete(next), 700);
      }

      return next;
    });
  };

  return (
    <div className="arcade-screen level-one-screen">
      <div className="screen-topbar">
        <div>
          <span className="board-badge">Level 1</span>
          <h2>Sky Balloon Blitz</h2>
        </div>

        <div className="screen-stats">
          <span>Score: {score}</span>
          <span>Target: {levelOneTarget}</span>
          <button className="ghost-button mini-button" onClick={() => onBack(score)}>
            Exit
          </button>
        </div>
      </div>

      <div className="level-one-arena">
        <div className="night-moon" />
        <div className="star-cluster star-cluster-one" />
        <div className="star-cluster star-cluster-two" />
        <div className="star-cluster star-cluster-three" />
        <div className="neon-haze neon-haze-left" />
        <div className="neon-haze neon-haze-right" />
        <div className="city-silhouette city-back" />
        <div className="city-silhouette city-front" />

        {items.map((item) => (
          <button
            key={item.id}
            className={`falling-item ${item.type === 'bomb' ? 'falling-bomb' : `falling-${item.color}`}`}
            style={{ top: `${item.top}%`, left: item.left }}
            onClick={() => handleItemClick(item)}
          >
            <span className="falling-item-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="game-instructions">
        <span>Catch balloons worth 5 points.</span>
        <span>Rare gold balloons give 10 points.</span>
        <span>Touching a bomb ends the run instantly.</span>
      </div>

      {status === 'gameover' && (
        <div className="overlay-card">
          <span className="board-badge">Game Over</span>
          <h3>You tapped a bomb.</h3>
          <p>Your score stopped at {score}. Restart Level 1 and try again.</p>
          <div className="overlay-actions">
            <button className="celebrate-button" onClick={resetGame}>
              Retry Level 1
            </button>
            <button className="ghost-button" onClick={() => onBack(score)}>
              Back to Home
            </button>
          </div>
        </div>
      )}

      {status === 'won' && (
        <div className="overlay-card">
          <span className="board-badge">Level Cleared</span>
          <h3>The birthday cake surprise is unlocked.</h3>
          <p>You reached {score} points. Opening the final surprise now.</p>
        </div>
      )}
    </div>
  );
}

export default LevelOneGame;
