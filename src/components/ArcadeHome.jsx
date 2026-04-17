function ArcadeHome({ games, levelOneBest, surpriseUnlocked, onPlayLevelOne }) {
  return (
    <div className="arcade-home">
      <div className="arcade-hero">
        <div className="arcade-copy">
          <p className="eyebrow">Arcade Platform</p>
          <h1>Play the balloon game and unlock the birthday cake surprise.</h1>
          <p className="intro">
            Keeping it simple: clear the balloon round, then the final birthday cake animation
            opens right away.
          </p>

          <div className="moment-strip">
            <span>One game only</span>
            <span>Pop balloons</span>
            <span>Cake surprise at the end</span>
          </div>
        </div>

        <div className="arcade-status-card">
          <span className="tip-label">Session progress</span>
          <p>Balloon game: Ready to play</p>
          <p>Cake surprise: {surpriseUnlocked ? 'Unlocked in this session' : 'Locked till 50 points'}</p>
          <p>Best Level 1 score: {levelOneBest}</p>
        </div>
      </div>

      <div className="game-card-grid">
        {games.map((game) => (
          <article key={game.id} className="game-card">
              <span className="game-card-badge">{game.badge}</span>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <small>{game.meta}</small>

              <button className="celebrate-button game-card-button" onClick={onPlayLevelOne}>
                Play now
              </button>
            </article>
        ))}
      </div>
    </div>
  );
}

export default ArcadeHome;
