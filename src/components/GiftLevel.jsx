function GiftLevel({ round, totalRounds, boxes, onPick }) {
  return (
    <div className="level-board gift-board">
      <div className="board-header">
        <span className="board-badge">Level 2</span>
        <h2>Find the hidden gift box that carries the secret surprise.</h2>
      </div>

      <div className="gift-grid">
        {boxes.map((box) => (
          <button
            key={`${box.id}-${box.wobbleKey}`}
            className={`gift-box ${box.wobbleKey ? 'gift-box-miss' : ''}`}
            onClick={() => onPick(box.id)}
          >
            <span className="gift-lid" />
            <span className="gift-ribbon" />
            <span className="gift-tag">Pick me</span>
          </button>
        ))}
      </div>

      <p className="board-footer">
        Gift round {round} of {totalRounds}
      </p>
    </div>
  );
}

export default GiftLevel;
