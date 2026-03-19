import { Chessboard, objToFen } from './chessboard.js';
const { parse } = PgnParser;
import { move_sound, getRandomInt } from './utils.js'

import { italian_game } from './lines/italian-game.js';
import { fried_liver } from './lines/fried-liver-pgns.js';
import { against_caro_kann } from './lines/against_caro_kann.js';
import { scandi } from './lines/scandi.js';
import { sicilian } from './lines/sicilian.js';
import { queens_gambit } from './lines/queens_gambit.js';
import { E4E5 } from './lines/E4.js';


let possible_lines = {};
possible_lines["E4E5.boden_kieseritzky_gambit"]=E4E5.boden_kieseritzky_gambit;
possible_lines["scandi.icbm"]=scandi.icbm;
possible_lines["scandi.RCA1"]=scandi.RCA1;

possible_lines["scandi.ER"]=scandi.ER;
// here if the opponent knows whats up:
// https://lichess.org/QTRcKh9S/white#21

possible_lines["scandi.Stockfish"]=scandi.Stockfish;
possible_lines["italian_game.italian_gambit_knight_takes1"]=italian_game.italian_gambit_knight_takes1;
possible_lines["sicilian.NF3_vs_staircase_and_dragon"]=sicilian.NF3_vs_staircase_and_dragon;
possible_lines["sicilian.alapin_vs_NC6"]=sicilian.alapin_vs_NC6;
possible_lines["sicilian.magnus_trap"]=sicilian.magnus_trap;
possible_lines["sicilian.schrantz_traps"]=sicilian.schrantz_traps;
possible_lines["fried_liver.with_castling"]=fried_liver.with_castling;
possible_lines["against_caro_kann.remote_chess_academy"]=against_caro_kann.remote_chess_academy;
possible_lines["E5.jonathan_schranz_most_complicated_gambit_ever1"]=E4E5.jonathan_schranz_most_complicated_gambit_ever1;

let possible_lines_size = Object.keys(possible_lines).length;

let lines = document.getElementById('lines');
for( let key in possible_lines) {
  lines.add(new Option(key));
}

document.getElementById('caption').innerText ="";

let pgn = possible_lines["E4E5.boden_kieseritzky_gambit"];


// TODO: Add code that saves played lines and will not go down that path against_caro_kann
// TODO: Also add code that reloads the line so we don't lose the played lines list

let pgn_moves = parse(pgn, { startRule: 'game' }).moves;

if (false) {
  pgn_moves[5].variations = []; // remove anti fried liver move.
}

var config = {
  draggable: true,
  position: 'start',
  onDrop: onDrop,
};

var internal_board = new Chess();
var visible_board = Chessboard('board1', config);

lines.addEventListener("change", ()=>{

  let pgn = possible_lines[lines.selectedOptions[0].value];
  pgn_moves = parse(pgn, { startRule: 'game' }).moves;
  internal_board.reset();
  visible_board.start();
  move_counter = 0
})


var move_counter = 0;

function make_move_in_internal_board(notation) {
  console.log(
    'making this move in internal board: ' + JSON.stringify(notation)
  );
  let result = internal_board.move(notation);
  if (!result) {
    console.warn('could not move: ' + notation);
  }
  return result;
}

document.getElementById('move').addEventListener('click', ()=>{
  let result = make_move_in_internal_board(pgn_moves[move_counter++].notation.notation);
  visible_board.move(result.from + '-' + result.to);
  setTimeout(()=>{
    result = make_move_in_internal_board(pgn_moves[move_counter++].notation.notation);
    visible_board.move(result.from + '-' + result.to);
  }, 200);
});

function onDrop(source, target, piece, newPos, oldPos) {
  if (source == target) return;

  if (internal_board.in_checkmate()) {
    return;
  }

  setTimeout(() => {

    if( source == 'e1' && target == 'g1' && piece == 'wK') {
      // castling
      console.log("castling detected.");
      visible_board.move("h1-f1");
      newPos = visible_board.position();
    }

    let pgn_player_move = pgn_moves[move_counter++];

    move_sound.play();
    make_move_in_internal_board(pgn_player_move.notation.notation); // { from: source, to: target }

    let internal_board_fen = internal_board.fen().split(' ')[0];
    let visible_board_fen = objToFen(newPos);

    if (internal_board_fen == visible_board_fen) {
      // IF INTERNAL AND VISIBLE BOARD HAVE THE SAME STATE, THE PLAYER MADE THE CORRECT MOVE.
      // NOW COMES THE COMPUTERS MOVE:
      let pgn_opponent_move = pgn_moves[move_counter++];
      let len = 0;

      if (pgn_opponent_move == undefined) {
        alert('You Win!');
        return;
      }

      if (
        pgn_opponent_move.variations &&
        (len = pgn_opponent_move.variations.length)
      ) {
        console.log('opponent move has variations: ' + len);
        var r = getRandomInt(len + 1);
        console.log('using variation: ' + r);
        if (r > 0) {
          pgn_moves = pgn_opponent_move.variations[r - 1];

          move_counter = 0;
          pgn_opponent_move = pgn_moves[move_counter++];
        }
      }

      console.log('opponent moves: ' + pgn_opponent_move.notation.notation);
      let result = make_move_in_internal_board(
        pgn_opponent_move.notation.notation
      );
      if (internal_board.in_checkmate()) {
        alert('Congratulations You Win!');
      }

      visible_board.move(result.from + '-' + result.to);
    } else {
      console.log("internal_board_fen: " + internal_board_fen);
      console.log("visible_board_fen: " + visible_board_fen);
      alert(
        'WRONG MOVE. Correct move was: ' + pgn_player_move.notation.notation
      );
      console.log('Correct move was: ' + pgn_player_move.notation.notation);
      visible_board.position(oldPos);
      internal_board.load(objToFen(oldPos));
      move_counter--;
    }
  }, 20);
}
