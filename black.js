import { Chessboard, objToFen } from './chessboard.js';
const { parse } = PgnParser;
import { move_sound, getRandomInt } from './utils.js'

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

let lines = document.getElementById('lines');
for (let key in possible_lines) {
  lines.add(new Option(key));
}

let caption = document.getElementById('caption');
caption.innerText = "";

let pgn_moves = parse(possible_lines[Object.keys(possible_lines)[0]], { startRule: 'game' }).moves;

var config = {
  draggable: true,
  position: 'start',
  onDrop: onDrop,
  orientation: 'black'
};

var internal_board = new Chess();
var visible_board = Chessboard('board1', config);

var move_counter = 0;

function make_move_in_internal_board(notation) {
  console.log('making this move in internal board: ' + JSON.stringify(notation));
  let result = internal_board.move(notation);
  if (!result) {
    console.warn('could not move: ' + notation);
  }
  return result;
}

function play_opponent_first_move() {
  let pgn_opponent_move = pgn_moves[move_counter++];
  console.log('opponent moves: ' + pgn_opponent_move.notation.notation);
  let result = make_move_in_internal_board(pgn_opponent_move.notation.notation);
  visible_board.move(result.from + '-' + result.to);
}

play_opponent_first_move();

lines.addEventListener("change", () => {
  let pgn = possible_lines[lines.selectedOptions[0].value];
  pgn_moves = parse(pgn, { startRule: 'game' }).moves;
  internal_board.reset();
  visible_board.start();
  move_counter = 0;
  caption.innerText = "";
  play_opponent_first_move();
});

document.getElementById('move').addEventListener('click', () => {
  let result = make_move_in_internal_board(pgn_moves[move_counter++].notation.notation);
  visible_board.move(result.from + '-' + result.to);
  setTimeout(() => {
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
    if (source == 'e8' && target == 'g8' && piece == 'bK') {
      visible_board.move("h8-f8");
      newPos = visible_board.position();
    }
    if (source == 'e8' && target == 'c8' && piece == 'bK') {
      visible_board.move("a8-d8");
      newPos = visible_board.position();
    }

    let pgn_player_move = pgn_moves[move_counter++];

    move_sound.play();
    make_move_in_internal_board(pgn_player_move.notation.notation);

    let internal_board_fen = internal_board.fen().split(' ')[0];
    let visible_board_fen = objToFen(newPos);

    if (internal_board_fen == visible_board_fen) {
      let pgn_opponent_move = pgn_moves[move_counter++];
      let len = 0;

      if (pgn_opponent_move == undefined) {
        caption.innerText = "You Win!";
        return;
      }

      if (pgn_opponent_move.variations && (len = pgn_opponent_move.variations.length)) {
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
      let result = make_move_in_internal_board(pgn_opponent_move.notation.notation);
      if (internal_board.in_checkmate()) {
        caption.innerText = "Congratulations You Win!";
      }

      visible_board.move(result.from + '-' + result.to);
      if (result.from == 'e1' && result.to == 'g1' && (result.color + result.piece) == 'wk') {
        visible_board.move("h1-f1");
        newPos = visible_board.position();
      }
    } else {
      console.log("internal_board_fen: " + internal_board_fen);
      console.log("visible_board_fen: " + visible_board_fen);
      caption.innerText = 'Wrong move. Correct: ' + pgn_player_move.notation.notation;
      console.log('Correct move was: ' + pgn_player_move.notation.notation);
      visible_board.position(oldPos);
      internal_board.load(objToFen(oldPos));
      move_counter--;
    }
  }, 20);
}
