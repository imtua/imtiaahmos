class WindowManager {
    constructor() {
        this.highestZ = 10;
        this.canvas = document.getElementById('desktop-canvas');
    }

    createWindow(id, title, contentHTML, options = {}) {
        if (document.getElementById(`win-${id}`)) {
            this.focusWindow(document.getElementById(`win-${id}`));
            return;
        }

        const width = options.width || '650px';
        const height = options.height || '420px';

        const win = document.createElement('div');
        win.id = `win-${id}`;
        win.className = 'imt-window';
        win.style.width = width;
        win.style.height = height;
        win.style.top = `${60 + Math.random() * 40}px`;
        win.style.left = `${100 + Math.random() * 60}px`;
        win.style.zIndex = ++this.highestZ;

        win.innerHTML = `
      <div class="window-header">
        <div class="window-controls">
          <button class="win-btn close-btn" onclick="wm.closeWindow('${id}')"></button>
          <button class="win-btn minimize-btn" onclick="wm.minimizeWindow('${id}')"></button>
          <button class="win-btn maximize-btn" onclick="wm.maximizeWindow('${id}')"></button>
        </div>
        <div class="window-title">${title}</div>
      </div>
      <div class="window-body">${contentHTML}</div>
    `;

        this.canvas.appendChild(win);
        this.makeDraggable(win);

        win.addEventListener('mousedown', () => this.focusWindow(win));
    }

    focusWindow(win) {
        this.highestZ++;
        win.style.zIndex = this.highestZ;
    }

    closeWindow(id) {
        const win = document.getElementById(`win-${id}`);
        if (win) win.remove();
    }

    minimizeWindow(id) {
        const win = document.getElementById(`win-${id}`);
        if (win) win.style.display = 'none';
    }

    makeDraggable(win) {
        const header = win.querySelector('.window-header');
        let isDragging = false;
        let offsetX = 0, offsetY = 0;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - win.offsetLeft;
            offsetY = e.clientY - win.offsetTop;
            this.focusWindow(win);
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            win.style.left = `${e.clientX - offsetX}px`;
            win.style.top = `${e.clientY - offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
}

const wm = new WindowManager();