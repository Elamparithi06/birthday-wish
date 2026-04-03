import { useEffect, useMemo, useRef, useState } from 'react';
import { createPotRound, levelTwoLives } from '../data/gameData';
import { requestGenieReply } from '../lib/genieClient';
import { createInitialGenieConversation } from '../lib/genieScript';

const shuffleDuration = 680;

function LevelTwoGame({ onBack, onComplete, playerName = 'Birthday Girl' }) {
  const [round, setRound] = useState(() => createPotRound());
  const [order, setOrder] = useState([0, 1, 2, 3]);
  const [phase, setPhase] = useState('intro');
  const [lives, setLives] = useState(levelTwoLives);
  const [message, setMessage] = useState('A gift will be placed under one shell. Watch closely.');
  const [shellMotion, setShellMotion] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [genieConversation, setGenieConversation] = useState(() => createInitialGenieConversation(playerName));
  const [genieThinking, setGenieThinking] = useState(false);
  const [canReveal, setCanReveal] = useState(false);
  const shuffleTimerRef = useRef(null);
  const placementTimerRef = useRef(null);
  const retryTimerRef = useRef(null);
  const successTimerRef = useRef(null);

  const orderedPots = useMemo(
    () => order.map((slotIndex) => round.pots[slotIndex]),
    [order, round.pots],
  );

  const clearAllTimers = () => {
    if (shuffleTimerRef.current) {
      window.clearInterval(shuffleTimerRef.current);
      shuffleTimerRef.current = null;
    }

    if (placementTimerRef.current) {
      window.clearTimeout(placementTimerRef.current);
      placementTimerRef.current = null;
    }

    if (retryTimerRef.current) {
      window.clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }

    if (successTimerRef.current) {
      window.clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  };

  const resetGenie = () => {
    setChatInput('');
    setGenieThinking(false);
    setCanReveal(false);
    setGenieConversation(createInitialGenieConversation(playerName));
  };

  const createSwapPlan = (currentOrder, steps = 3) => {
    const plan = [];
    let workingOrder = [...currentOrder];

    for (let step = 0; step < steps; step += 1) {
      const leftIndex = step % 2 === 0 ? step % 3 : (step + 1) % 3;
      const rightIndex = leftIndex + 1;
      const nextOrder = [...workingOrder];

      [nextOrder[leftIndex], nextOrder[rightIndex]] = [nextOrder[rightIndex], nextOrder[leftIndex]];
      plan.push({ nextOrder, leftIndex, rightIndex });
      workingOrder = nextOrder;
    }

    return plan;
  };

  const startShuffle = (nextRound) => {
    clearAllTimers();

    const sourceRound = nextRound ?? createPotRound();

    setRound(sourceRound);
    setOrder([0, 1, 2, 3]);
    setShellMotion({});
    setPhase('shuffling');
    setMessage('The shells are crossing over the mat. Keep tracking the hidden gift.');

    const swapPlan = createSwapPlan([0, 1, 2, 3], 3);
    let steps = 0;
    shuffleTimerRef.current = window.setInterval(() => {
      const move = swapPlan[steps];

      if (!move) {
        window.clearInterval(shuffleTimerRef.current);
        shuffleTimerRef.current = null;
        setShellMotion({});
        setPhase('choose');
        setMessage('Pick the pot that hides the gift.');
        return;
      }

      const motion = {};
      const leftShell = move.nextOrder[move.leftIndex];
      const rightShell = move.nextOrder[move.rightIndex];

      motion[sourceRound.pots[leftShell].id] = 'shell-move-left';
      motion[sourceRound.pots[rightShell].id] = 'shell-move-right';

      setShellMotion(motion);
      setOrder(move.nextOrder);
      steps += 1;
    }, shuffleDuration);
  };

  const beginRound = (nextRound) => {
    clearAllTimers();

    const sourceRound = nextRound ?? createPotRound();
    setRound(sourceRound);
    setOrder([0, 1, 2, 3]);
    setShellMotion({});
    setPhase('placing');
    setMessage('The host is placing the gift under one shell. Watch the table carefully.');

    placementTimerRef.current = window.setTimeout(() => {
      startShuffle(sourceRound);
    }, 1500);
  };

  useEffect(() => () => clearAllTimers(), []);

  const revealSurprise = () => {
    setPhase('won');
    setMessage('The genie finally gives up and opens the hidden reward.');
    successTimerRef.current = window.setTimeout(() => onComplete(), 900);
  };

  const handlePick = (potId) => {
    if (phase !== 'choose') {
      return;
    }

    if (potId === round.winningPotId) {
      setPhase('won');
      setMessage('Correct pot selected. Opening the hidden reward.');
      successTimerRef.current = window.setTimeout(() => onComplete(), 800);
      return;
    }

    const nextLives = lives - 1;
    setLives(nextLives);

    if (nextLives <= 0) {
      setPhase('genie');
      resetGenie();
      setMessage('The shuffle is over. Now the genie wants to argue with you instead.');
      return;
    }

    setPhase('miss');
    setMessage(`Wrong pot. ${nextLives} lives left. Reshuffling now.`);
    retryTimerRef.current = window.setTimeout(() => beginRound(), 750);
  };

  const handleRetry = () => {
    setLives(levelTwoLives);
    resetGenie();
    beginRound();
  };

  const handleStart = () => {
    setLives(levelTwoLives);
    resetGenie();
    beginRound(round);
  };

  const handleGenieSubmit = async () => {
    const input = chatInput.trim();
    if (!input || genieThinking || canReveal) {
      return;
    }

    const nextConversation = [...genieConversation, { speaker: 'player', text: input }];
    const turn = nextConversation.filter((entry) => entry.speaker === 'player').length - 1;

    setGenieConversation(nextConversation);
    setChatInput('');
    setGenieThinking(true);

    const response = await requestGenieReply({
      playerName,
      input,
      turn,
      history: nextConversation,
    });

    window.setTimeout(() => {
      setGenieConversation((current) => [...current, { speaker: 'genie', text: response.reply }]);
      setGenieThinking(false);

      if (response.reveal) {
        setCanReveal(true);
        setMessage('The genie has annoyed the player enough. The surprise can be revealed now.');
      }
    }, 420);
  };

  const handleGenieKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleGenieSubmit();
    }
  };

  return (
    <div className="arcade-screen level-two-screen">
      <div className="screen-topbar">
        <div>
          <span className="board-badge">Level 2</span>
          <h2>Beach Pot Shuffle</h2>
        </div>

        <div className="screen-stats">
          <div className="chance-track" aria-label={`Chances left ${lives}`}>
            {[0, 1, 2].map((chance) => (
              <span
                key={chance}
                className={`chance-orb ${chance < lives ? 'chance-orb-active' : 'chance-orb-lost'}`}
              />
            ))}
          </div>
          <span>Chances: {lives}</span>
          <span>Goal: Find the hidden gift</span>
          <button className="ghost-button mini-button" onClick={onBack}>
            Exit
          </button>
        </div>
      </div>

      <div className="level-two-arena">
        <div className="shell-game-stage">
          <div className="shell-table-overlay">
            <div className="table-ball" />

            {orderedPots.map((pot, index) => (
              <button
                key={pot.id}
                className={`real-shell-button ${
                  phase === 'shuffling' ? 'real-shell-button-shuffling' : ''
                } ${phase === 'placing' && pot.id === round.winningPotId ? 'real-shell-button-lifted' : ''}`}
                style={{
                  left: `${18 + index * 19}%`,
                  '--shuffle-duration': `${shuffleDuration}ms`,
                }}
                data-motion={shellMotion[pot.id] ?? ''}
                onClick={() => handlePick(pot.id)}
              >
                {phase === 'placing' && pot.id === round.winningPotId && <span className="real-gift-token" />}
                <span className="real-shell-rim" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <span>{message}</span>
        <span>{phase === 'genie' ? 'The genie chat does not help find the shell. It only annoys, then reveals.' : 'Lose both chances and the genie will take over.'}</span>
      </div>

      {phase === 'miss' && (
        <div className="overlay-card">
          <span className="board-badge">Wrong Shell</span>
          <h3>You lost 1 chance.</h3>
          <p>{lives} chance{lives === 1 ? '' : 's'} left. Reshuffling now.</p>
        </div>
      )}

      {phase === 'genie' && (
        <div className="overlay-card genie-card">
          <div className="genie-thread">
            {genieConversation.map((entry, index) => (
              <div
                key={`${entry.speaker}-${index}`}
                className={`genie-bubble ${entry.speaker === 'player' ? 'genie-bubble-player' : 'genie-bubble-bot'}`}
              >
                {entry.text}
              </div>
            ))}
            {genieThinking && <div className="genie-bubble genie-bubble-bot">Thinking of a more annoying reply...</div>}
          </div>
          {!canReveal && (
            <div className="genie-composer">
              <input
                className="genie-input"
                type="text"
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                onKeyDown={handleGenieKeyDown}
                placeholder={`Try answering the genie about ${playerName}`}
              />
              <button className="celebrate-button genie-send-button" onClick={handleGenieSubmit}>
                Send
              </button>
            </div>
          )}
          {canReveal && (
            <div className="overlay-actions">
              <button className="celebrate-button" onClick={revealSurprise}>
                Reveal Surprise
              </button>
            </div>
          )}
        </div>
      )}

      {phase === 'won' && (
        <div className="overlay-card">
          <span className="board-badge">Gift Found</span>
          <h3>You found the correct pot.</h3>
          <p>Opening the hidden surprise now.</p>
        </div>
      )}

      {phase === 'intro' && (
        <div className="overlay-card">
          <span className="board-badge">Before Level 2</span>
          <h3>Watch the shell with the hidden gift.</h3>
          <p>
            The host places one gift under a shell, then shuffles all four quickly across the table.
            You only get 2 chances, and the shells only shuffle 3 times.
          </p>
          <div className="overlay-actions">
            <button className="celebrate-button" onClick={handleStart}>
              Start Level 2
            </button>
            <button className="ghost-button" onClick={onBack}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LevelTwoGame;
