document.addEventListener('DOMContentLoaded', () => {
    // 1. Live Clock
    function updateClock() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const clockEl = document.getElementById('system-clock');
        if (clockEl) clockEl.textContent = timeStr;
    }
    updateClock();
    setInterval(updateClock, 1000);

    // 2. Dock Click Listeners
    document.querySelectorAll('.dock-item').forEach(item => {
        item.addEventListener('click', () => {
            const appType = item.getAttribute('data-app');

            if (appType === 'terminal') {
                if (typeof window.initTerminalApp === 'function') {
                    window.initTerminalApp();
                } else {
                    console.error('initTerminalApp function not found! Check script order.');
                }
            } else if (appType === 'calculator') {
                if (typeof window.initCalculatorApp === 'function') {
                    window.initCalculatorApp();
                } else {
                    console.error('initCalculatorApp function not found! Check script order.');
                }
            } else if (appType === 'logbook') {
                if (typeof window.initLogbookApp === 'function') {
                    window.initLogbookApp();
                }
            } else if (appType === 'widgets') {
                if (typeof window.initWidgetsApp === 'function') {
                    window.initWidgetsApp();
                }
            } else if (appType === 'mediaplayer') {
                if (typeof window.initMediaPlayerApp === 'function') {
                    window.initMediaPlayerApp();
                }
            }
        });
    });

    // 3. Menu

    const launcherBtn = document.getElementById('app-launcher-btn');
    const appMenu = document.getElementById('app-menu');

    if (launcherBtn && appMenu) {
        launcherBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            appMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!appMenu.contains(e.target) && e.target !== launcherBtn) {
                appMenu.classList.add('hidden');
            }
        });
    }

    document.querySelectorAll('.app-menu-card').forEach(card => {
        card.addEventListener('click', () => {
            const app = card.getAttribute('data-app');
            appMenu.classList.add('hidden');

            switch (app) {
                case 'terminal':
                    if (typeof window.initTerminalApp === 'function') {
                        window.initTerminalApp();
                    }
                    break;

                case 'mediaplayer':
                    if (typeof window.initMediaPlayerApp === 'function') {
                        window.initMediaPlayerApp();
                    }
                    break;

                case 'widgets':
                    if (typeof window.initWidgetsApp === 'function') {
                        window.initWidgetsApp();
                    }
                    break;

                case 'gallery':
                    if (typeof window.initGalleryApp === 'function') {
                        window.initGalleryApp();
                    }
                    break;

                case 'calculator':
                    if (typeof window.initCalculatorApp === 'function') {
                        window.initCalculatorApp();
                    }
                    break;

                case 'tictactoe':
                    if (typeof window.initTicTacToeApp === 'function') {
                        window.initTicTacToeApp();
                    }
                    break;

                case 'guessnumber':
                    if (typeof window.initGuessNumberApp === 'function') {
                        window.initGuessNumberApp();
                    }
                    break;

                case 'showcase':
                    if (typeof window.initShowcaseApp === 'function') {
                        window.initShowcaseApp();
                    }
                    break;

                case 'logbook':
                    if (typeof window.initLogbookApp === 'function') {
                        window.initLogbookApp();
                    }
                    break;

                case 'contact':
                    if (typeof window.initContactApp === 'function') {
                        window.initContactApp();
                    }
                    break;

                default:
                    break;

            }
        })
    })
});