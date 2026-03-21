# Chess Trainer

Train online: [rhulha.github.io/ChessTrainer/](https://rhulha.github.io/ChessTrainer/)

A browser-based chess opening trainer. Practice lines as white or black against a scripted opponent.

## Usage

Open `index.html` to play as white, or `index.html?side=black` to play as black. The nav link at the bottom of the page toggles between the two.

Select an opening line from the dropdown, then make your moves on the board. The opponent responds automatically. If you play the wrong move, the correct move is shown in the caption. Use "Show Next Move" to step through the line manually.

## Structure

- `white-lines/` — opening lines played as white
- `black-lines/` — opening lines played as black
- `js/main.js` — entry point, picks white/black config based on `?side=` param
- `js/trainer.js` — core game logic
- `js/chessboard.js` — board rendering
- `js/pgn-parser.js` — minimal PGN parser
- `js/utils.js` — shared utilities

## Dependencies (loaded via CDN)

- [chess.js](https://github.com/jhlywa/chess.js/)
