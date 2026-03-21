import { createTrainer } from './trainer.js';

import { italian_game } from './white-lines/italian-game.js';
import { fried_liver } from './white-lines/fried-liver-pgns.js';
import { against_caro_kann } from './white-lines/against_caro_kann.js';
import { scandi } from './white-lines/scandi.js';
import { sicilian } from './white-lines/sicilian.js';
import { queens_gambit } from './white-lines/queens_gambit.js';
import { E4E5 } from './white-lines/E4.js';

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
