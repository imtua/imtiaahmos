window.initWidgetsApp = function () {
    const widgetsHTML = `
    <div class="widgets-container">
      <div class="widget-card clock-card">
        <div class="widget-label">TIME & DATE</div>
        <div id="widget-big-time" class="big-time">00:00:00</div>
        <div id="widget-full-date" class="full-date">Loading date...</div>
      </div>

      <div class="widget-card stats-card">
        <div class="widget-label">SYSTEM METRICS</div>
        <div class="stat-bar-group">
          <div class="stat-info"><span>CPU Usage</span><span id="cpu-pct">24%</span></div>
          <div class="bar-bg"><div id="cpu-bar" class="bar-fill" style="width: 24%;"></div></div>
        </div>
        <div class="stat-bar-group">
          <div class="stat-info"><span>Memory (RAM)</span><span id="ram-pct">42%</span></div>
          <div class="bar-bg"><div id="ram-bar" class="bar-fill" style="width: 42%;"></div></div>
        </div>
        <div class="stat-bar-group">
          <div class="stat-info"><span>ImtOS Storage</span><span>128 GB / 512 GB</span></div>
          <div class="bar-bg"><div class="bar-fill" style="width: 25%;"></div></div>
        </div>
      </div>

      <div class="widget-card memo-card">
        <div class="widget-label">QUICK MEMO</div>
        <textarea id="widget-memo" placeholder="Jot down quick thoughts or code snippets..."></textarea>
      </div>

      <div class="widget-card quote-card">
        <div class="widget-label">Quote of Doom</div>
        <p class="quote-text">"Hell answers to me for I am Doom."</p>
        <span class="quote-author">— Victor Von Doom</span>
      </div>
    </div>
  `;

    wm.createWindow('widgets', 'System Widgets Hub', widgetsHTML, { width: '680px', height: '460px' });

    setTimeout(() => {
        const bigTime = document.getElementById('widget-big-time');
        const fullDate = document.getElementById('widget-full-date');
        const memo = document.getElementById('widget-memo');
        const cpuBar = document.getElementById('cpu-bar');
        const cpuPct = document.getElementById('cpu-pct');
        const ramBar = document.getElementById('ram-bar');
        const ramPct = document.getElementById('ram-pct');

        function updateWidgetTime() {
            const now = new Date();
            if (bigTime) bigTime.textContent = now.toLocaleTimeString();
            if (fullDate) fullDate.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        }
        updateWidgetTime();
        const timeInterval = setInterval(updateWidgetTime, 1000);

        if (memo) {
            memo.value = localStorage.getItem('imtos_quick_memo') || '';
            memo.addEventListener('input', () => {
                localStorage.setItem('imtos_quick_memo', memo.value);
            });
        }

        const statsInterval = setInterval(() => {
            if (!cpuBar) return;
            const randomCpu = Math.floor(Math.random() * 25) + 15;
            const randomRam = Math.floor(Math.random() * 10) + 40;
            cpuBar.style.width = randomCpu + '%';
            if (cpuPct) cpuPct.textContent = randomCpu + '%';
            ramBar.style.width = randomRam + '%';
            if (ramPct) ramPct.textContent = randomRam + '%';
        }, 2500);

    }, 100);
};