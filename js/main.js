import { createTrainer } from './trainer.js';

import { italian_game } from './white-lines/italian-game.js';
import { fried_liver } from './white-lines/fried-liver-pgns.js';
import { against_caro_kann } from './white-lines/against_caro_kann.js';
import { scandi } from './white-lines/scandi.js';
import { sicilian } from './white-lines/sicilian.js';
import { queens_gambit } from './white-lines/queens_gambit.js';
import { E4E5 } from './white-lines/E4.js';

import { E5 as D4E5 } from './black-lines/D4.js';
import { E5 as E4E5_black, russian_game } from './black-lines/E4.js';

const side = new URLSearchParams(location.search).get('side');

if (side === 'black') {
  const modules = { D4E5, E4E5: E4E5_black, russian_game };
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
} else {
  const modules = { italian_game, fried_liver, against_caro_kann, scandi, sicilian, queens_gambit, E4E5 };
  const possible_lines = Object.fromEntries(
    Object.entries(modules).flatMap(([name, mod]) =>
      Object.keys(mod).map(line => [`${name}.${line}`, mod[line]])
    )
  );
  createTrainer(possible_lines, {
    playerCastlingMoves: [
      { source: 'e1', target: 'g1', piece: 'wK', rook_from: 'h1', rook_to: 'f1' },
    ],
  });
}
