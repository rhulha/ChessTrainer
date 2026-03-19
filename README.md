# Chess Trainer

A browser-based chess opening trainer. Practice lines as white or black against a scripted opponent.

## Usage

Open `index.html` to play as white, or `black.html` to play as black.

Select an opening line from the dropdown, then make your moves on the board. The opponent responds automatically. If you play the wrong move, the correct move is shown in the caption. Use "Show Next Move" to step through the line manually.

## Structure

- `white-lines/` — opening lines played as white
- `black-lines/` — opening lines played as black
- `white.js` / `black.js` — game logic for each color
- `chessboard.js` — board rendering
- `utils.js` — shared utilities

## Dependencies (loaded via CDN)

- [chessboard.js](https://chessboardjs.com/)
- [chess.js](https://github.com/jhlywa/chess.js/)
- [pgn-parser](https://github.com/mliebelt/pgn-parser)
- jQuery
