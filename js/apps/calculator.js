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
        <button class="calc-btn action" data-action="clear"><img src="assets/icons/calculator/clear.svg" alt="Clear"></button>
        <button class="calc-btn action" data-action="parentheses"><img src="assets/icons/calculator/parentheses.svg" alt="Parentheses"></button>
        <button class="calc-btn action" data-action="backspace"><img src="assets/icons/calculator/backspace.svg" alt="Backspace"></button>
        <button class="calc-btn op" data-val="/"><img src="assets/icons/calculator/divide.svg" alt="Divide"></button>

        <button class="calc-btn num" data-val="7"><img src="assets/icons/calculator/7.svg" alt="7"></button>
        <button class="calc-btn num" data-val="8"><img src="assets/icons/calculator/8.svg" alt="8"></button>
        <button class="calc-btn num" data-val="9"><img src="assets/icons/calculator/9.svg" alt="9"></button>
        <button class="calc-btn op" data-val="*"><img src="assets/icons/calculator/multiply.svg" alt="Multiply"></button>

        <button class="calc-btn num" data-val="4"><img src="assets/icons/calculator/4.svg" alt="4"></button>
        <button class="calc-btn num" data-val="5"><img src="assets/icons/calculator/5.svg" alt="5"></button>
        <button class="calc-btn num" data-val="6"><img src="assets/icons/calculator/6.svg" alt="6"></button>
        <button class="calc-btn op" data-val="-"><img src="assets/icons/calculator/minus.svg" alt="Subtract"></button>

        <button class="calc-btn num" data-val="1"><img src="assets/icons/calculator/1.svg" alt="1"></button>
        <button class="calc-btn num" data-val="2"><img src="assets/icons/calculator/2.svg" alt="2"></button>
        <button class="calc-btn num" data-val="3"><img src="assets/icons/calculator/3.svg" alt="3"></button>
        <button class="calc-btn op" data-val="+"><img src="assets/icons/calculator/plus.svg" alt="Add"></button>

        <button class="calc-btn num" data-val="0"><img src="assets/icons/calculator/0.svg" alt="0"></button>
        <button class="calc-btn num" data-val="."><img src="assets/icons/calculator/dot.svg" alt="Decimal"></button>
        <button class="calc-btn action" data-action="percent"><img src="assets/icons/calculator/percent.svg" alt="Percent"></button>
        <button class="calc-btn equals" data-action="equals"><img src="assets/icons/calculator/equal.svg" alt="Equals"></button>
      </div>
    </div>
  `;

    wm.createWindow('calculator', 'Calculator', calcHTML, { width: '340px', height: '460px' });

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