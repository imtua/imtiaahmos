window.initGuessNumberApp = function () {
    let secretNumber = Math.floor(Math.random() * 100) + 1;
    let remainingAttempts = 10;
    let gameOver = false;
    let history = [];

    const gameHTML = `
    <div class="gn-container">
      <div class="gn-header">
        <span class="gn-badge">Chances Left: <strong id="gn-attempts">10</strong>/10</span>
        <button id="gn-reset-btn" class="gn-icon-btn" title="Restart Game">🔄 Reset</button>
      </div>

      <div class="gn-feedback-box" id="gn-feedback">
        Guess a number between <strong>1</strong> and <strong>100</strong>!
      </div>

      <form id="gn-form" class="gn-input-wrap">
        <input type="number" id="gn-input" min="1" max="100" placeholder="Enter (1-100)..." required autofocus autocomplete="off" />
        <button type="submit" id="gn-submit-btn" class="gn-btn">Guess</button>
      </form>

      <div class="gn-history-wrap">
        <div class="gn-history-title">Guess History</div>
        <div class="gn-history-tags" id="gn-history-tags">
          <span class="gn-empty-hint">No guesses yet</span>
        </div>
      </div>
    </div>
  `;

    wm.createWindow('guessnumber', 'Guess The Number', gameHTML, { width: '420px', height: '430px' });

    setTimeout(() => {
        const form = document.getElementById('gn-form');
        const input = document.getElementById('gn-input');
        const feedback = document.getElementById('gn-feedback');
        const attemptsEl = document.getElementById('gn-attempts');
        const historyTags = document.getElementById('gn-history-tags');
        const resetBtn = document.getElementById('gn-reset-btn');

        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (gameOver) return;

            const guess = parseInt(input.value.trim(), 10);
            if (isNaN(guess) || guess < 1 || guess > 100) return;

            input.value = '';
            remainingAttempts--;
            attemptsEl.textContent = remainingAttempts;

            if (guess === secretNumber) {
                feedback.className = 'gn-feedback-box success';
                feedback.innerHTML = `🎉 <strong>SPOT ON!</strong> You guessed <strong>${secretNumber}</strong> correctly!`;
                endGame(true);
                addHistoryTag(guess, 'correct');
                return;
            }

            const hint = guess < secretNumber ? 'HIGHER ⬆️' : 'LOWER ⬇️';
            const hintClass = guess < secretNumber ? 'higher' : 'lower';
            addHistoryTag(guess, hintClass);

            if (remainingAttempts <= 0) {
                feedback.className = 'gn-feedback-box danger';
                feedback.innerHTML = `💀 <strong>Game Over!</strong> The secret number was <strong>${secretNumber}</strong>.`;
                endGame(false);
            } else {
                feedback.className = `gn-feedback-box ${hintClass}`;
                feedback.innerHTML = `Go <strong>${hint}</strong> than ${guess}!`;
            }
        });

        resetBtn.addEventListener('click', () => {
            secretNumber = Math.floor(Math.random() * 100) + 1;
            remainingAttempts = 10;
            gameOver = false;
            history = [];

            attemptsEl.textContent = '10';
            feedback.className = 'gn-feedback-box';
            feedback.innerHTML = 'Guess a number between <strong>1</strong> and <strong>100</strong>!';
            historyTags.innerHTML = '<span class="gn-empty-hint">No guesses yet</span>';
            input.disabled = false;
            document.getElementById('gn-submit-btn').disabled = false;
            input.focus();
        });

        function endGame(isWin) {
            gameOver = true;
            input.disabled = true;
            document.getElementById('gn-submit-btn').disabled = true;
        }

        function addHistoryTag(num, type) {
            if (history.length === 0) historyTags.innerHTML = '';
            history.push(num);

            const tag = document.createElement('span');
            tag.className = `gn-tag ${type}`;
            tag.textContent = num;
            historyTags.appendChild(tag);
        }
    }, 100);
};