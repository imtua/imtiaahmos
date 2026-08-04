window.initCalculatorApp = function () {
    let currentExpr = '';
    let lastResult = '';

    const calcHTML = `
    <div class="calc-container">
      <!-- Calculator Display Screen -->
      <div class="calc-screen">
        <div id="calc-history" class="calc-history"></div>
        <div id="calc-main" class="calc-main">0</div>
      </div>

      <!-- Keypad Grid -->
      <div class="calc-grid">
        <button class="calc-btn action" data-action="clear">C</button>
        <button class="calc-btn action" data-action="parentheses">( )</button>
        <button class="calc-btn action" data-action="backspace">⌫</button>
        <button class="calc-btn op" data-val="/">÷</button>

        <button class="calc-btn num" data-val="7">7</button>
        <button class="calc-btn num" data-val="8">8</button>
        <button class="calc-btn num" data-val="9">9</button>
        <button class="calc-btn op" data-val="*">×</button>

        <button class="calc-btn num" data-val="4">4</button>
        <button class="calc-btn num" data-val="5">5</button>
        <button class="calc-btn num" data-val="6">6</button>
        <button class="calc-btn op" data-val="-">−</button>

        <button class="calc-btn num" data-val="1">1</button>
        <button class="calc-btn num" data-val="2">2</button>
        <button class="calc-btn num" data-val="3">3</button>
        <button class="calc-btn op" data-val="+">+</button>

        <button class="calc-btn num" data-val="0">0</button>
        <button class="calc-btn num" data-val=".">.</button>
        <button class="calc-btn action" data-action="percent">%</button>
        <button class="calc-btn equals" data-action="equals">=</button>
      </div>
    </div>
  `;

    wm.createWindow('calculator', 'BODMAS Calculator', calcHTML, { width: '340px', height: '460px' });

    setTimeout(() => {
        const mainDisplay = document.getElementById('calc-main');
        const historyDisplay = document.getElementById('calc-history');
        const container = document.querySelector('.calc-container');

        if (!mainDisplay) return;

        function updateDisplay() {
            mainDisplay.textContent = currentExpr || '0';
        }

        function appendVal(val) {
            if (lastResult !== '' && !['+', '-', '*', '/', '%'].includes(val)) {
                currentExpr = '';
            }
            lastResult = '';
            currentExpr += val;
            updateDisplay();
        }

        function handleAction(action) {
            if (action === 'clear') {
                currentExpr = '';
                lastResult = '';
                historyDisplay.textContent = '';
                updateDisplay();
            } else if (action === 'backspace') {
                currentExpr = currentExpr.slice(0, -1);
                updateDisplay();
            } else if (action === 'parentheses') {
                const openParen = (currentExpr.match(/\(/g) || []).length;
                const closeParen = (currentExpr.match(/\)/g) || []).length;
                const lastChar = currentExpr.slice(-1);

                if (openParen > closeParen && !['(', '+', '-', '*', '/'].includes(lastChar)) {
                    currentExpr += ')';
                } else {
                    currentExpr += '(';
                }
                updateDisplay();
            } else if (action === 'percent') {
                if (currentExpr !== '') {
                    currentExpr += '/100';
                    calculateResult();
                }
            } else if (action === 'equals') {
                calculateResult();
            }
        }

        function calculateResult() {
            if (!currentExpr) return;
            try {
                // Sanitize & Evaluate BODMAS Expression safely
                const sanitized = currentExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
                const result = Function(`'use strict'; return (${sanitized})`)();

                historyDisplay.textContent = currentExpr + ' =';
                currentExpr = String(result);
                lastResult = currentExpr;
                updateDisplay();
            } catch (err) {
                mainDisplay.textContent = 'Error';
                setTimeout(() => updateDisplay(), 1200);
            }
        }

        // Button Click Listener
        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.calc-btn');
            if (!btn) return;

            if (btn.dataset.val) {
                appendVal(btn.dataset.val);
            } else if (btn.dataset.action) {
                handleAction(btn.dataset.action);
            }
        });

        // Keyboard Input Support
        const keyHandler = (e) => {
            if (!document.getElementById('win-calculator')) return;

            if (/\d/.test(e.key) || ['.', '+', '-', '*', '/'].includes(e.key)) {
                appendVal(e.key);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                calculateResult();
            } else if (e.key === 'Backspace') {
                handleAction('backspace');
            } else if (e.key === 'Escape') {
                handleAction('clear');
            }
        };

        document.addEventListener('keydown', keyHandler);
    }, 100);
};