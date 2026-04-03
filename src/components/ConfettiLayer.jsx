import { confettiPieces } from '../data/sceneData';

function ConfettiLayer({ celebrating }) {
  if (!celebrating) {
    return null;
  }

  return (
    <div className="confetti-layer" aria-hidden="true">
      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti"
          style={{
            left: piece.left,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            rotate: piece.rotation,
          }}
        />
      ))}
    </div>
  );
}

export default ConfettiLayer;
