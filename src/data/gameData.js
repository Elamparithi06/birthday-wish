export const levelOneTarget = 50;
export const levelTwoLives = 2;

export const arcadeGames = [
  {
    id: 'level1',
    badge: 'Level 1',
    title: 'Sky Balloon Blitz',
    description:
      'Catch balloons falling from the sky, avoid the bombs, and score 50 points to unlock the next stage.',
    meta: '5-point balloons, rare 10-point balloons, instant bomb fail',
  },
  {
    id: 'level2',
    badge: 'Level 2',
    title: 'Beach Pot Shuffle',
    description:
      'A hidden gift sits inside one of four beach pots. Follow the shuffle and pick the right one before your 2 chances run out.',
    meta: 'Beach table shuffle, 2 chances, reveal reward inside the winning pot',
  },
];

export function createFallingItem(spawnCount) {
  const tenPointTurns = [5, 11, 17];
  const isBomb = spawnCount % 4 === 0 || spawnCount % 9 === 0;
  const isRare = tenPointTurns.includes(spawnCount);

  if (isBomb) {
    return {
      id: `${spawnCount}-bomb`,
      type: 'bomb',
      points: 0,
      label: 'Bomb',
      left: `${8 + ((spawnCount * 17) % 76)}%`,
      speed: 1.6 + (spawnCount % 3) * 0.18,
      color: 'bomb',
    };
  }

  return {
    id: `${spawnCount}-balloon`,
    type: 'balloon',
    points: isRare ? 10 : 5,
    label: isRare ? '+10' : '+5',
    left: `${10 + ((spawnCount * 13) % 72)}%`,
    speed: 1.45 + (spawnCount % 4) * 0.16,
    color: isRare ? 'gold' : ['pink', 'blue', 'peach'][spawnCount % 3],
  };
}

export function createPotRound() {
  const potIds = ['a', 'b', 'c', 'd'];
  const winningPotId = potIds[Math.floor(Math.random() * potIds.length)];

  return {
    pots: potIds.map((id) => ({ id })),
    winningPotId,
  };
}

export function shuffleOrder(order) {
  const next = [...order];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}
