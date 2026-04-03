export const confettiPieces = Array.from({ length: 24 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 4.1) % 92)}%`,
  delay: `${(index % 8) * 0.18}s`,
  duration: `${3.4 + (index % 5) * 0.35}s`,
  rotation: `${(index * 37) % 360}deg`,
}));

export const candles = ['Make a wish', 'Cut the cake', 'Celebrate big', 'Smile forever'];
