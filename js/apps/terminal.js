window.initTerminalApp = function () {
    const terminalHTML = `
    <div class="terminal-container">
      <div class="terminal-output" id="term-output">
        <div class="term-line welcome">ImtOS System Terminal</div>
        <div class="term-line">Type <span class="highlight">'help'</span> to view available system commands or easter eggs.</div>
      </div>
      <div class="terminal-input-row">
        <span class="prompt">imtiaz@imtOS:~$</span>
        <input type="text" id="term-input" autofocus autocomplete="off" spellcheck="false" />
      </div>
    </div>
  `;

    wm.createWindow('terminal', 'Terminal — imtiaz@ImtOS', terminalHTML, { width: '680px', height: '420px' });

    setTimeout(() => {
        const input = document.getElementById('term-input');
        const output = document.getElementById('term-output');
        if (!input) return;

        input.focus();

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim().toLowerCase();
                appendLine(`imtiaz@imtOS:~$ ${input.value}`, 'user-cmd');
                input.value = '';

                handleCommand(cmd);
                output.scrollTop = output.scrollHeight;
            }
        });

        function appendLine(text, className = '') {
            const line = document.createElement('div');
            line.className = `term-line ${className}`;
            line.innerHTML = text;
            output.appendChild(line);
        }

        function handleCommand(cmd) {
            switch (cmd) {
                case 'help':
                    appendLine(`
            <b>System Commands:</b><br/>
            - <b>whoami</b>   : Display user identity & role<br/>
            - <b>bio</b>      : Personal background & story<br/>
            - <b>projects</b> : Quick list of featured builds<br/>
            - <b>photo</b>    : [Easter Egg] Reveal photograph<br/>
            - <b>secret</b>   : [Easter Egg] System mystery<br/>
            - <b>clear</b>    : Clear terminal screen
          `, 'info');
                    break;

                case 'whoami':
                    appendLine('Imtiaz Ahmed — Developer, Founder & Designer', 'success');
                    break;

                case 'bio':
                    appendLine('I love creating things that make a difference.', 'info');
                    break;

                case 'projects':
                    appendLine('ill do that later, wan sam tea? :3', 'highlight');
                    break;

                case 'photo':
                    appendLine(`
            <div class="terminal-photo-card">
              <img src="easter.png" alt="Thumbs up cat" style="max-width: 100%; border-radius: 8px; margin: 8px 0;" />
              <p><i>good job, you found the easter egg! thas a cat.</i></p>
            </div>
          `, 'easter-egg');
                    break;

                case 'secret':
                    appendLine('that\'s my secret, cap. I\'m always angry (elite avengers knowledge :3)', 'success');
                    break;

                case 'clear':
                    output.innerHTML = '';
                    break;

                case '':
                    break;

                default:
                    appendLine(`Command not found: '${cmd}'. Type 'help' for options.`, 'error');
                    break;
            }
        }
    }, 100);
};