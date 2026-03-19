import { createTrainer } from './trainer.js';

import { E5 as D4E5 } from './black-lines/D4.js';
import { E5 as E4E5, russian_game } from './black-lines/E4.js';

let possible_lines = {};
possible_lines["D4.Derek_Wu_Trap"] = D4E5.Derek_Wu_Trap_as_black;
possible_lines["E4E5.turkish_gambit"] = E4E5.turkish_gambit;
possible_lines["E4E5.against_italian"] = E4E5.against_italian;
possible_lines["E4E5.traxler_taking_bishop"] = E4E5.traxler_taking_the_bishop;
possible_lines["E4E5.traxler_not_taking_bishop"] = E4E5.traxler_not_taking_the_bishop;
possible_lines["E4E5.rousseau_gambit"] = E4E5.rousseau_gambit;
possible_lines["russian_game.stafford_gambit"] = russian_game.stafford_gambit_rca_variation;

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
