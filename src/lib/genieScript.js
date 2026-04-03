function normalize(input) {
  return input.trim().toLowerCase();
}

function isYes(input) {
  const text = normalize(input);
  return text === 'yes' || text === 'y' || text.includes('yes') || text.includes('i am');
}

function isNo(input) {
  const text = normalize(input);
  return text === 'no' || text === 'n' || text.includes('no') || text.includes('not');
}

function asksDeveloper(input) {
  return normalize(input).includes('developer');
}

function asksWhat(input) {
  const text = normalize(input);
  return text.includes('what') || text.includes('why') || text.includes('said');
}

export function createInitialGenieConversation(playerName) {
  return [
    {
      speaker: 'genie',
      text: `Are you ${playerName}?`,
    },
  ];
}

export function getGenieReply({ playerName, input, turn }) {
  if (turn === 0) {
    if (isYes(input)) {
      return `Are you sure you are ${playerName}?`;
    }

    if (isNo(input)) {
      return `The developer told me you are ${playerName}.`;
    }

    return `That was not a proper answer. Are you ${playerName} or not?`;
  }

  if (turn === 1) {
    if (asksDeveloper(input)) {
      return 'We will not reveal who the developer is.';
    }

    if (isYes(input)) {
      return `I am not convinced. The developer said you are not ${playerName}.`;
    }

    if (isNo(input)) {
      return `Interesting. Two seconds ago you were practically ${playerName}.`;
    }

    return 'That made the situation somehow more suspicious.';
  }

  if (turn === 2) {
    if (asksWhat(input) || asksDeveloper(input)) {
      return 'The developer told me to annoy you.';
    }

    return 'You are arguing with a genie and somehow losing.';
  }

  if (turn === 3) {
    return 'I could keep doing this all day, but the surprise is getting impatient.';
  }

  return 'Fine. You survived the nonsense. I am opening the surprise now.';
}

export function shouldRevealAfterTurn(turn) {
  return turn >= 4;
}
