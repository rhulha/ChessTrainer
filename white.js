import { createTrainer } from './trainer.js';

import { italian_game } from './white-lines/italian-game.js';
import { fried_liver } from './white-lines/fried-liver-pgns.js';
import { against_caro_kann } from './white-lines/against_caro_kann.js';
import { scandi } from './white-lines/scandi.js';
import { sicilian } from './white-lines/sicilian.js';
import { queens_gambit } from './white-lines/queens_gambit.js';
import { E4E5 } from './white-lines/E4.js';

let possible_lines = {};
possible_lines["E4E5.boden_kieseritzky_gambit"] = E4E5.boden_kieseritzky_gambit;
possible_lines["scandi.icbm"] = scandi.icbm;
possible_lines["scandi.RCA1"] = scandi.RCA1;
possible_lines["scandi.ER"] = scandi.ER;
// here if the opponent knows whats up:
// https://lichess.org/QTRcKh9S/white#21
possible_lines["scandi.Stockfish"] = scandi.Stockfish;
possible_lines["italian_game.italian_gambit_knight_takes1"] = italian_game.italian_gambit_knight_takes1;
possible_lines["sicilian.NF3_vs_staircase_and_dragon"] = sicilian.NF3_vs_staircase_and_dragon;
possible_lines["sicilian.alapin_vs_NC6"] = sicilian.alapin_vs_NC6;
possible_lines["sicilian.magnus_trap"] = sicilian.magnus_trap;
possible_lines["sicilian.schrantz_traps"] = sicilian.schrantz_traps;
possible_lines["fried_liver.with_castling"] = fried_liver.with_castling;
possible_lines["against_caro_kann.remote_chess_academy"] = against_caro_kann.remote_chess_academy;
possible_lines["E5.jonathan_schranz_most_complicated_gambit_ever1"] = E4E5.jonathan_schranz_most_complicated_gambit_ever1;

createTrainer(possible_lines, {
  playerCastlingMoves: [
    { source: 'e1', target: 'g1', piece: 'wK', rook_from: 'h1', rook_to: 'f1' },
  ],
});
