import { useEffect, useState } from 'react';
import ArcadeHome from './components/ArcadeHome';
import BirthdayCakeSurprise from './components/BirthdayCakeSurprise';
import Footer from './components/Footer';
import LevelOneGame from './components/LevelOneGame';
import Navbar from './components/Navbar';
import { arcadeGames } from './data/gameData';

function App() {
  const [screen, setScreen] = useState('home');
  const [levelOneBest, setLevelOneBest] = useState(0);
  const [surpriseUnlocked, setSurpriseUnlocked] = useState(false);
  const birthdayName = 'Roopan';
  const isGameScreen = screen === 'level1';

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const handleLevelOneWin = (score) => {
    setLevelOneBest((current) => Math.max(current, score));
    setSurpriseUnlocked(true);
    setScreen('reveal');
  };

  const handleLevelOneExit = (score) => {
    setLevelOneBest((current) => Math.max(current, score));
    setScreen('home');
  };

  return (
    <main className={`app-shell ${screen === 'reveal' ? 'is-celebrating' : ''}`}>
      <div className="aurora aurora-left" />
      <div className="aurora aurora-right" />

      <div className={`platform-shell ${isGameScreen ? 'platform-shell-game' : ''}`}>
        <Navbar />

        <section className={`platform-stage ${isGameScreen ? 'platform-stage-game' : ''}`}>
          {screen === 'home' && (
            <ArcadeHome
              games={arcadeGames}
              levelOneBest={levelOneBest}
              surpriseUnlocked={surpriseUnlocked}
              onPlayLevelOne={() => setScreen('level1')}
            />
          )}

          {screen === 'level1' && (
            <LevelOneGame onBack={handleLevelOneExit} onComplete={handleLevelOneWin} />
          )}

          {screen === 'reveal' && (
            <div className="reveal-shell">
              <div className="reveal-sidebar">
                <p className="eyebrow">Reward Unlocked</p>
                <h1>The balloon game opened the birthday surprise.</h1>
                <p className="intro">
                  You cleared the balloon round, so the final birthday cake animation is live now.
                </p>

                <div className="moment-strip">
                  <span>Balloon game cleared</span>
                  <span>Cake surprise unlocked</span>
                  <span>Birthday reveal live</span>
                </div>

                <button className="ghost-button reveal-home-button" onClick={() => setScreen('home')}>
                  Back to Home
                </button>
              </div>

              <BirthdayCakeSurprise birthdayName={birthdayName} />
            </div>
          )}
        </section>

        {!isGameScreen && <Footer />}
      </div>
    </main>
  );
}

export default App;
