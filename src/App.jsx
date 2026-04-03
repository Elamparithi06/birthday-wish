import { useEffect, useState } from 'react';
import ArcadeHome from './components/ArcadeHome';
import Footer from './components/Footer';
import LevelOneGame from './components/LevelOneGame';
import LevelTwoGame from './components/LevelTwoGame';
import Navbar from './components/Navbar';
import Scene from './components/Scene';
import { arcadeGames } from './data/gameData';

function App() {
  const [screen, setScreen] = useState('home');
  const [levelOneUnlocked, setLevelOneUnlocked] = useState(true);
  const [levelTwoUnlocked, setLevelTwoUnlocked] = useState(false);
  const [levelOneBest, setLevelOneBest] = useState(0);
  const birthdayName = 'Birthday Girl';
  const isGameScreen = screen === 'level1' || screen === 'level2';

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
    setLevelTwoUnlocked(true);
    setScreen('level2');
  };

  const handleLevelOneExit = (score) => {
    setLevelOneBest((current) => Math.max(current, score));
    setScreen('home');
  };

  const handleLevelTwoExit = () => {
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
              levelOneUnlocked={levelOneUnlocked}
              levelTwoUnlocked={levelTwoUnlocked}
              levelOneBest={levelOneBest}
              onPlayLevelOne={() => setScreen('level1')}
              onPlayLevelTwo={() => {
                if (levelTwoUnlocked) {
                  setScreen('level2');
                }
              }}
            />
          )}

          {screen === 'level1' && (
            <LevelOneGame onBack={handleLevelOneExit} onComplete={handleLevelOneWin} />
          )}

          {screen === 'level2' && (
            <LevelTwoGame
              onBack={handleLevelTwoExit}
              onComplete={() => setScreen('reveal')}
              playerName={birthdayName}
            />
          )}

          {screen === 'reveal' && (
            <div className="reveal-shell">
              <div className="reveal-sidebar">
                <p className="eyebrow">Reward Unlocked</p>
                <h1>The arcade was just the disguise.</h1>
                <p className="intro">
                  Level 1 and Level 2 are cleared. The hidden reward is finally ready to open.
                </p>

                <div className="moment-strip">
                  <span>Session complete</span>
                  <span>Secret reward found</span>
                  <span>Birthday reveal live</span>
                </div>

                <button className="ghost-button reveal-home-button" onClick={() => setScreen('home')}>
                  Back to Arcade Home
                </button>
              </div>

              <Scene celebrating birthdayName={birthdayName} />
            </div>
          )}
        </section>

        {!isGameScreen && <Footer />}
      </div>
    </main>
  );
}

export default App;
