window.initLogbookApp = function () {
    // In-memory array (resets upon page refresh)
    let notes = [
        {
            id: 1,
            title: 'Welcome Note',
            content: 'Follow @imtiaahm on Instagram',
            date: new Date().toLocaleDateString()
        }
    ];

    function renderLogbookHTML() {
        return `
      <div class="logbook-container">
        <!-- New Note Input Form -->
        <div class="logbook-form-card">
          <div class="logbook-form-title">ADD A NEW LOG</div>
          <form id="logbook-form">
            <input type="text" id="log-title" placeholder="Note Title..." required autocomplete="off" />
            <textarea id="log-content" placeholder="Write your thoughts or notes here..." required></textarea>
            <button type="submit" class="logbook-submit-btn">+ Add Log</button>
          </form>
        </div>

        <!-- Notes List View -->
        <div class="logbook-notes-wrap">
          <div class="logbook-section-title">LOG ENTRIES (${notes.length})</div>
          <div class="logbook-list" id="logbook-list">
            ${notes.map(note => `
              <div class="logbook-card">
                <div class="logbook-card-header">
                  <span class="logbook-card-title">${note.title}</span>
                  <span class="logbook-card-date">${note.date}</span>
                </div>
                <p class="logbook-card-content">${note.content}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    }

    wm.createWindow('logbook', 'Logbook & Notes', renderLogbookHTML(), { width: '560px', height: '480px' });

    // Event Handlers
    setTimeout(() => {
        const win = document.getElementById('win-logbook');
        if (!win) return;

        function attachLogbookEvents() {
            const form = win.querySelector('#logbook-form');
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const titleInput = win.querySelector('#log-title');
                const contentInput = win.querySelector('#log-content');

                const title = titleInput.value.trim();
                const content = contentInput.value.trim();

                if (!title || !content) return;

                // Push new note to in-memory array
                notes.unshift({
                    id: Date.now(),
                    title: title,
                    content: content,
                    date: new Date().toLocaleDateString()
                });

                // Re-render window body with updated list
                win.querySelector('.window-body').innerHTML = renderLogbookHTML();
                attachLogbookEvents();
            });
        }

        attachLogbookEvents();
    }, 100);
};