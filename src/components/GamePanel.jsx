function GamePanel({
  stage,
  poppedCount,
  balloonGoal,
  giftRound,
  giftRoundGoal,
  content,
  highlights,
  onRestart,
}) {
  const progressValue =
    stage === 'balloons'
      ? (poppedCount / balloonGoal) * 100
      : stage === 'gifts'
        ? (giftRound / giftRoundGoal) * 100
        : 100;

  return (
    <div className="game-panel">
      <p className="eyebrow">{content.eyebrow}</p>
      <h1>{content.title}</h1>
      <p className="intro">{content.description}</p>

      <div className="progress-card">
        <div className="progress-copy">
          <span className="progress-label">{content.progressLabel}</span>
          <strong>{content.progressValue({ poppedCount, balloonGoal, giftRound, giftRoundGoal })}</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span className="progress-fill" style={{ width: `${Math.min(progressValue, 100)}%` }} />
        </div>
      </div>

      <div className="tip-card">
        <span className="tip-label">Mission note</span>
        <p>{content.tip}</p>
      </div>

      <div className="moment-strip">
        {content.steps.map((step) => (
          <span key={step}>{step}</span>
        ))}
      </div>

      <div className="platform-highlights">
        {highlights.map((item) => (
          <article key={item.title} className="highlight-card">
            <span className="highlight-kicker">{item.kicker}</span>
            <strong>{item.title}</strong>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      {stage === 'reveal' && (
        <button className="ghost-button" onClick={onRestart}>
          Play Again
        </button>
      )}
    </div>
  );
}

export default GamePanel;
