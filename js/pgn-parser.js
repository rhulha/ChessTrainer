export function parse(pgn, _options) {
  const tokens = tokenize(pgn);
  const state = { pos: 0 };
  return { moves: parseMoveList(tokens, state) };
}

function tokenize(pgn) {
  const tokens = [];
  let i = 0;

  while (i < pgn.length) {
    const c = pgn[i];

    if (/\s/.test(c)) { i++; continue; }

    if (c === '{') {
      while (i < pgn.length && pgn[i] !== '}') i++;
      if (i < pgn.length) i++;
      continue;
    }

    if (c === '(' || c === ')') { tokens.push(c); i++; continue; }

    if (c === '$') {
      i++;
      while (i < pgn.length && /\d/.test(pgn[i])) i++;
      continue;
    }

    if (c === '!' || c === '?') {
      while (i < pgn.length && (pgn[i] === '!' || pgn[i] === '?')) i++;
      continue;
    }

    if (c === '*') { i++; continue; }

    if (/\d/.test(c)) {
      while (i < pgn.length && /\d/.test(pgn[i])) i++;
      if (i < pgn.length && (pgn[i] === '-' || pgn[i] === '/')) {
        while (i < pgn.length && !/\s/.test(pgn[i])) i++;
      } else {
        while (i < pgn.length && pgn[i] === '.') i++;
      }
      continue;
    }

    if (/[a-zA-Z]/.test(c)) {
      if (pgn.slice(i, i + 5) === 'O-O-O') {
        const start = i;
        i += 5;
        if (i < pgn.length && (pgn[i] === '+' || pgn[i] === '#')) i++;
        tokens.push(pgn.slice(start, i));
      } else if (pgn.slice(i, i + 3) === 'O-O') {
        const start = i;
        i += 3;
        if (i < pgn.length && (pgn[i] === '+' || pgn[i] === '#')) i++;
        tokens.push(pgn.slice(start, i));
      } else {
        const start = i;
        while (i < pgn.length && /[a-zA-Z0-9=+#x]/.test(pgn[i])) i++;
        tokens.push(pgn.slice(start, i));
      }
      continue;
    }

    i++;
  }

  return tokens;
}

function parseMoveList(tokens, state) {
  const moves = [];

  while (state.pos < tokens.length) {
    const token = tokens[state.pos];

    if (token === ')') break;

    if (token === '(') {
      state.pos++;
      const variation = parseMoveList(tokens, state);
      if (state.pos < tokens.length && tokens[state.pos] === ')') state.pos++;
      if (moves.length > 0) {
        const lastMove = moves[moves.length - 1];
        if (!lastMove.variations) lastMove.variations = [];
        lastMove.variations.push(variation);
      }
    } else {
      moves.push({ notation: { notation: token } });
      state.pos++;
    }
  }

  return moves;
}
