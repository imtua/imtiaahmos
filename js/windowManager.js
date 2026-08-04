class WindowManager {
    constructor() {
        this.windows = new Map();
        this.highestZIndex = 100;
        this.spawnOffset = 0;
    }

    /**
     * Create and render a new window or focus it if it already exists
     */
    createWindow(id, title, contentHTML, options = {}) {
        const existingWin = document.getElementById(`win-${id}`);
        if (existingWin) {
            this.bringToFront(existingWin);
            existingWin.style.display = 'flex';
            return existingWin;
        }

        const width = options.width || '520px';
        const height = options.height || '420px';

        // Calculate centered initial position with cascading offset
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const numericWidth = parseInt(width) || 500;
        const numericHeight = parseInt(height) || 400;

        let initialLeft = Math.max(80, (viewportWidth - numericWidth) / 2 + this.spawnOffset);
        let initialTop = Math.max(50, (viewportHeight - numericHeight) / 2 + this.spawnOffset);

        // Cycle spawn offset so multiple opened windows cascade nicely
        this.spawnOffset = (this.spawnOffset + 24) % 120;

        // Build Window DOM Structure
        const win = document.createElement('div');
        win.id = `win-${id}`;
        win.className = 'window';
        win.style.width = width;
        win.style.height = height;
        win.style.left = `${initialLeft}px`;
        win.style.top = `${initialTop}px`;
        win.style.zIndex = ++this.highestZIndex;

        win.innerHTML = `
      <div class="window-header">
        <div class="window-controls">
          <button class="win-btn win-close" title="Close"></button>
          <button class="win-btn win-minimize" title="Minimize"></button>
          <button class="win-btn win-maximize" title="Maximize"></button>
        </div>
        <div class="window-title">${title}</div>
      </div>
      <div class="window-body">
        ${contentHTML}
      </div>
    `;

        document.body.appendChild(win);
        this.windows.set(id, win);

        // Attach Interactivity
        this.makeDraggable(win);
        this.setupWindowEvents(win, id);
        this.bringToFront(win);

        return win;
    }

    /**
     * Smooth dragging logic bound strictly to header
     */
    makeDraggable(windowEl) {
        const header = windowEl.querySelector('.window-header');
        if (!header) return;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        header.addEventListener('mousedown', (e) => {
            // Ignore clicks on control buttons
            if (e.target.closest('.window-controls') || e.target.closest('button')) return;

            isDragging = true;
            this.bringToFront(windowEl);

            startX = e.clientX;
            startY = e.clientY;

            const rect = windowEl.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // Add active drag visual state
            header.style.cursor = 'grabbing';

            const onMouseMove = (moveEvent) => {
                if (!isDragging) return;
                const dx = moveEvent.clientX - startX;
                const dy = moveEvent.clientY - startY;

                // Keep window header accessible within viewport boundaries
                const newLeft = initialLeft + dx;
                const newTop = Math.max(30, initialTop + dy); // Don't drag above top bar

                windowEl.style.left = `${newLeft}px`;
                windowEl.style.top = `${newTop}px`;
            };

            const onMouseUp = () => {
                isDragging = false;
                header.style.cursor = 'grab';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    /**
     * Z-Index Focus Stacking
     */
    bringToFront(windowEl) {
        this.highestZIndex += 1;
        windowEl.style.zIndex = this.highestZIndex;

        // Highlight active window visual state
        document.querySelectorAll('.window').forEach(w => w.classList.remove('active-window'));
        windowEl.classList.add('active-window');
    }

    /**
     * Close, Minimize, and Focus Controls
     */
    setupWindowEvents(windowEl, id) {
        // Bring to front on body click
        windowEl.addEventListener('mousedown', () => {
            this.bringToFront(windowEl);
        });

        const closeBtn = windowEl.querySelector('.win-close');
        const minimizeBtn = windowEl.querySelector('.win-minimize');
        const maximizeBtn = windowEl.querySelector('.win-maximize');

        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeWindow(id);
            });
        }

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                windowEl.style.display = 'none';
            });
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (windowEl.classList.contains('maximized')) {
                    windowEl.classList.remove('maximized');
                } else {
                    windowEl.classList.add('maximized');
                }
            });
        }
    }

    closeWindow(id) {
        const win = this.windows.get(id) || document.getElementById(`win-${id}`);
        if (win) {
            win.remove();
            this.windows.delete(id);
        }
    }
}

// Instantiate global WindowManager instance
window.wm = new WindowManager();