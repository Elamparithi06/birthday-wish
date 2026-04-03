function ArcadeHome({
  games,
  levelOneUnlocked,
  levelTwoUnlocked,
  levelOneBest,
  onPlayLevelOne,
  onPlayLevelTwo,
}) {
  return (
    <div className="arcade-home">
      <div className="arcade-hero">
        <div className="arcade-copy">
          <p className="eyebrow">Arcade Platform</p>
          <h1>Play the games, unlock the next level, and keep the reward hidden till the end.</h1>
          <p className="intro">
            This platform is disguised as a normal arcade site. Start with Level 1 and clear the
            score target to reveal Level 2.
          </p>

          <div className="moment-strip">
            <span>Level 1 first</span>
            <span>Unlock Level 2</span>
            <span>Hidden reward at the end</span>
          </div>
        </div>

        <div className="arcade-status-card">
          <span className="tip-label">Session progress</span>
          <p>Level 1 status: {levelOneUnlocked ? 'Ready to play' : 'Locked'}</p>
          <p>Level 2 status: {levelTwoUnlocked ? 'Unlocked in this session' : 'Locked till 50 points'}</p>
          <p>Best Level 1 score: {levelOneBest}</p>
        </div>
      </div>

      <div className="game-card-grid">
        {games.map((game) => {
          const isLevelTwo = game.id === 'level2';
          const locked = isLevelTwo && !levelTwoUnlocked;

          return (
            <article key={game.id} className={`game-card ${locked ? 'game-card-locked' : ''}`}>
              <span className="game-card-badge">{game.badge}</span>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <small>{game.meta}</small>

              <button
                className={locked ? 'ghost-button game-card-button' : 'celebrate-button game-card-button'}
                onClick={isLevelTwo ? onPlayLevelTwo : onPlayLevelOne}
                disabled={locked}
              >
                {locked ? 'Locked till Level 1 clears' : 'Play now'}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default ArcadeHome;
