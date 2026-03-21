const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';

const PIECE_IMAGES = {
  wK: 'img/Chess_klt45.svg',
  wQ: 'img/Chess_qlt45.svg',
  wR: 'img/Chess_rlt45.svg',
  wB: 'img/Chess_blt45.svg',
  wN: 'img/Chess_nlt45.svg',
  wP: 'img/Chess_plt45.svg',
  bK: 'img/Chess_kdt45.svg',
  bQ: 'img/Chess_qdt45.svg',
  bR: 'img/Chess_rdt45.svg',
  bB: 'img/Chess_bdt45.svg',
  bN: 'img/Chess_ndt45.svg',
  bP: 'img/Chess_pdt45.svg',
};

const FILES = 'abcdefgh'.split('');

export function fenToObj(fen) {
  const obj = {};
  const rows = fen.split('/');
  for (let r = 0; r < 8; r++) {
    let fileIdx = 0;
    for (const ch of rows[r]) {
      if (ch >= '1' && ch <= '8') {
        fileIdx += +ch;
      } else {
        const color = ch === ch.toUpperCase() ? 'w' : 'b';
        obj[FILES[fileIdx] + (8 - r)] = color + ch.toUpperCase();
        fileIdx++;
      }
    }
  }
  return obj;
}

export function objToFen(obj) {
  let fen = '';
  for (let r = 8; r >= 1; r--) {
    let empty = 0;
    for (let f = 0; f < 8; f++) {
      const piece = obj[FILES[f] + r];
      if (piece) {
        if (empty) { fen += empty; empty = 0; }
        fen += piece[0] === 'w' ? piece[1].toUpperCase() : piece[1].toLowerCase();
      } else {
        empty++;
      }
    }
    if (empty) fen += empty;
    if (r > 1) fen += '/';
  }
  return fen;
}

export function Chessboard(elementId, config) {
  const container = document.getElementById(elementId);
  const orientation = config.orientation || 'white';
  const onDrop = config.onDrop;

  let pos = config.position === 'start' ? fenToObj(START_FEN) : { ...(config.position || {}) };

  container.classList.add('chessboard');

  const squareEls = {};

  function buildBoard() {
    container.innerHTML = '';
    const rankOrder = orientation === 'white' ? [8,7,6,5,4,3,2,1] : [1,2,3,4,5,6,7,8];
    const fileOrder = orientation === 'white' ? FILES : [...FILES].reverse();

    for (const rank of rankOrder) {
      for (const file of fileOrder) {
        const sq = file + rank;
        const div = document.createElement('div');
        div.classList.add('square');
        const fileIdx = FILES.indexOf(file);
        div.classList.add((fileIdx + rank) % 2 !== 0 ? 'light-sq' : 'dark-sq');
        div.dataset.sq = sq;
        squareEls[sq] = div;
        container.appendChild(div);
      }
    }
  }

  function renderPieces() {
    for (const el of Object.values(squareEls)) {
      el.innerHTML = '';
    }
    for (const [sq, piece] of Object.entries(pos)) {
      const el = squareEls[sq];
      if (!el) continue;
      const img = document.createElement('img');
      img.src = PIECE_IMAGES[piece];
      img.draggable = false;
      el.appendChild(img);
    }
  }

  buildBoard();
  renderPieces();

  if (config.draggable) {
    let dragSource = null;
    let dragPiece = null;
    let ghost = null;

    container.addEventListener('mousedown', (e) => {
      const squareEl = e.target.closest('[data-sq]');
      if (!squareEl) return;
      const sq = squareEl.dataset.sq;
      if (!pos[sq]) return;

      dragSource = sq;
      dragPiece = pos[sq];

      const rect = squareEl.getBoundingClientRect();
      ghost = document.createElement('img');
      ghost.src = PIECE_IMAGES[dragPiece];
      ghost.style.cssText = `position:fixed;width:${rect.width}px;height:${rect.height}px;pointer-events:none;z-index:1000;`;
      ghost.style.left = (e.clientX - rect.width / 2) + 'px';
      ghost.style.top = (e.clientY - rect.height / 2) + 'px';
      document.body.appendChild(ghost);

      const srcImg = squareEl.querySelector('img');
      if (srcImg) srcImg.style.visibility = 'hidden';

      e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
      if (!ghost) return;
      ghost.style.left = (e.clientX - parseInt(ghost.style.width) / 2) + 'px';
      ghost.style.top = (e.clientY - parseInt(ghost.style.height) / 2) + 'px';
    });

    document.addEventListener('mouseup', (e) => {
      if (!ghost) return;
      ghost.remove();
      ghost = null;

      let targetSq = null;
      for (const [sq, el] of Object.entries(squareEls)) {
        const rect = el.getBoundingClientRect();
        if (e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top && e.clientY <= rect.bottom) {
          targetSq = sq;
          break;
        }
      }

      if (!targetSq || targetSq === dragSource) {
        const srcImg = squareEls[dragSource]?.querySelector('img');
        if (srcImg) srcImg.style.removeProperty('visibility');
        dragSource = null;
        dragPiece = null;
        return;
      }

      const oldPos = { ...pos };
      delete pos[dragSource];
      pos[targetSq] = dragPiece;
      const newPos = { ...pos };

      renderPieces();

      if (onDrop) onDrop(dragSource, targetSq, dragPiece, newPos, oldPos);

      dragSource = null;
      dragPiece = null;
    });
  }

  return {
    move(notation) {
      const [from, to] = notation.split('-');
      if (!pos[from]) return;
      pos[to] = pos[from];
      delete pos[from];
      renderPieces();
    },

    start() {
      pos = fenToObj(START_FEN);
      renderPieces();
    },

    position(arg) {
      if (arg === undefined) return { ...pos };
      pos = typeof arg === 'string' ? fenToObj(arg) : { ...arg };
      renderPieces();
    },
  };
}
