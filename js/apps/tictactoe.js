window.initTicTacToeApp = function () {
    let board = Array(9).fill(null);
    let playerSymbol = 'X';
    let cpuSymbol = 'O';
    let isPlayerTurn = true;
    let gameOver = false;
    let scores = { player: 0, cpu: 0, ties: 0 };

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    const gameHTML = `
    <div class="ttt-container">
      <div class="ttt-scoreboard">
        <div class="score-card">
          <span class="score-label">YOU (X)</span>
          <span id="score-player" class="score-val">0</span>
        </div>
        <div class="score-card">
          <span class="score-label">TIES</span>
          <span id="score-ties" class="score-val">0</span>
        </div>
        <div class="score-card">
          <span class="score-label">CPU (O)</span>
          <span id="score-cpu" class="score-val">0</span>
        </div>
      </div>

      <div class="ttt-status-row">
        <span id="ttt-status" class="ttt-status">Your turn (X)</span>
        <button id="ttt-reset-btn" class="ttt-reset-btn"> Reset Board</button>
      </div>

      <div class="ttt-grid" id="ttt-grid">
        ${Array(9).fill(0).map((_, i) => `<button class="ttt-cell" data-index="${i}"></button>`).join('')}
      </div>
    </div>
  `;

    wm.createWindow('tictactoe', 'Tic Tac Toe vs CPU', gameHTML, { width: '400px', height: '470px' });

    setTimeout(() => {
        const grid = document.getElementById('ttt-grid');
        const cells = document.querySelectorAll('.ttt-cell');
        const statusEl = document.getElementById('ttt-status');
        const resetBtn = document.getElementById('ttt-reset-btn');
        if (!grid) return;
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const idx = parseInt(cell.getAttribute('data-index'));
                if (board[idx] || !isPlayerTurn || gameOver) return;
                makeMove(idx, playerSymbol);
                if (checkWin(playerSymbol)) {
                    handleEndGame('win', `${playerSymbol} Wins! `);
                    scores.player++;
                    updateScoreboard();
                    return;
                }
                if (checkTie()) {
                    handleEndGame('tie', "It's a Tie! ");
                    scores.ties++;
                    updateScoreboard();
                    return;
                }
                isPlayerTurn = false;
                statusEl.textContent = 'CPU is thinking...';
                setTimeout(cpuMove, 400);
            });
        });
        function cpuMove() {
            if (gameOver) return;
            let bestMove = findBestMove(cpuSymbol) ?? findBestMove(playerSymbol) ?? getRandomMove();
            if (bestMove !== null && bestMove !== undefined) {
                makeMove(bestMove, cpuSymbol);
                if (checkWin(cpuSymbol)) {
                    handleEndGame('loss', 'CPU Wins! ');
                    scores.cpu++;
                    updateScoreboard();
                    return;
                }
                if (checkTie()) {
                    handleEndGame('tie', "It's a Tie! ");
                    scores.ties++;
                    updateScoreboard();
                    return;
                }
            }
            isPlayerTurn = true;
            statusEl.textContent = 'Your turn (X)';
        }
        function makeMove(idx, symbol) {
            board[idx] = symbol;
            const cell = cells[idx];
            cell.textContent = symbol;
            cell.classList.add('taken', symbol.toLowerCase());
        }
        function findBestMove(symbol) {
            for (let combo of winningCombos) {
                const [a, b, c] = combo;
                const vals = [board[a], board[b], board[c]];
                if (vals.filter(v => v === symbol).length === 2 && vals.includes(null)) {
                    return combo[vals.indexOf(null)];
                }
            }
            return null;
        }
        function getRandomMove() {
            const emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
            if (emptyIndices.length === 0) return null;
            return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }
        function checkWin(symbol) {
            return winningCombos.some(combo => {
                const isWin = combo.every(idx => board[idx] === symbol);
                if (isWin) {
                    combo.forEach(idx => cells[idx].classList.add('winning-cell'));
                }
                return isWin;
            });
        }
        function checkTie() {
            return board.every(cell => cell !== null);
        }
        function handleEndGame(type, msg) {
            gameOver = true;
            statusEl.textContent = msg;
        }
        function updateScoreboard() {
            document.getElementById('score-player').textContent = scores.player;
            document.getElementById('score-cpu').textContent = scores.cpu;
            document.getElementById('score-ties').textContent = scores.ties;
        }
        resetBtn.addEventListener('click', () => {
            board = Array(9).fill(null);
            isPlayerTurn = true;
            gameOver = false;
            statusEl.textContent = 'Your turn (X)';
            cells.forEach(cell => {
                cell.textContent = '';
                cell.className = 'ttt-cell';
            });
        });
    }, 100);
};