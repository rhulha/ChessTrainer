import { createTrainer } from './trainer.js';

import { E5 as D4E5 } from './black-lines/D4.js';
import { E5 as E4E5, russian_game } from './black-lines/E4.js';

const modules = { D4E5, E4E5, russian_game };

const possible_lines = Object.fromEntries(
  Object.entries(modules).flatMap(([name, mod]) =>
    Object.keys(mod).map(line => [`${name}.${line}`, mod[line]])
  )
);

createTrainer(possible_lines, {
  orientation: 'black',
  opponentPlaysFirst: true,
  playerCastlingMoves: [
    { source: 'e8', target: 'g8', piece: 'bK', rook_from: 'h8', rook_to: 'f8' },
    { source: 'e8', target: 'c8', piece: 'bK', rook_from: 'a8', rook_to: 'd8' },
  ],
  opponentCastlingMoves: [
    { source: 'e1', target: 'g1', colorPiece: 'wk', rook_from: 'h1', rook_to: 'f1' },
  ],
});
