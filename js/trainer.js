import { Chessboard, objToFen } from './chessboard.js';
import { parse } from './pgn-parser.js';
import { move_sound, getRandomInt } from './utils.js';

export function createTrainer(possible_lines, {
  orientation = 'white',
  opponentPlaysFirst = false,
  playerCastlingMoves = [],
  opponentCastlingMoves = [],
} = {}) {

  const opening = document.getElementById('opening');
  const lines = document.getElementById('lines');

  const openings = [...new Set(Object.keys(possible_lines).map(k => k.split('.')[0]))];
  for (const o of openings) opening.add(new Option(o));

  function populateLines(selectedOpening) {
    lines.innerHTML = '';
    for (const key of Object.keys(possible_lines).filter(k => k.startsWith(selectedOpening + '.'))) {
      lines.add(new Option(key.split('.').slice(1).join('.'), key));
    }
  }
  populateLines(openings[0]);

  opening.addEventListener('change', () => {
    populateLines(opening.value);
    lines.dispatchEvent(new Event('change'));
  });

  let caption = document.getElementById('caption');
  caption.innerText = "";

  let pgn_moves = parse(possible_lines[Object.keys(possible_lines)[0]], { startRule: 'game' }).moves;

  let config = {
    draggable: true,
    position: 'start',
    onDrop: onDrop,
  };
  if (orientation === 'black') {
    config.orientation = 'black';
  }

  let internal_board = new Chess();
  let visible_board = Chessboard('board1', config);

  let move_counter = 0;

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

  if (opponentPlaysFirst) {
    play_opponent_first_move();
  }

  lines.addEventListener("change", () => {
    let pgn = possible_lines[lines.value];
    pgn_moves = parse(pgn, { startRule: 'game' }).moves;
    internal_board.reset();
    visible_board.start();
    move_counter = 0;
    caption.innerText = "";
    if (opponentPlaysFirst) {
      play_opponent_first_move();
    }
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
      for (const c of playerCastlingMoves) {
        if (source == c.source && target == c.target && piece == c.piece) {
          visible_board.move(c.rook_from + '-' + c.rook_to);
          newPos = visible_board.position();
        }
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
          caption.innerText = 'You Win!';
          return;
        }

        if (pgn_opponent_move.variations && (len = pgn_opponent_move.variations.length)) {
          console.log('opponent move has variations: ' + len);
          let r = getRandomInt(len + 1);
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
          caption.innerText = 'Congratulations You Win!';
        }

        visible_board.move(result.from + '-' + result.to);

        for (const c of opponentCastlingMoves) {
          if (result.from == c.source && result.to == c.target && (result.color + result.piece) == c.colorPiece) {
            visible_board.move(c.rook_from + '-' + c.rook_to);
          }
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
}
