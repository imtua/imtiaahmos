window.initGalleryApp = function () {
    // Generate file paths for Imtiaz (15 photos) & Photographys (16 photos)
    const galleryData = {
        imtiaz: Array.from({ length: 15 }, (_, i) => ({
            id: i + 1,
            title: `Imtiaz — Photo ${i + 1}`,
            src: `assets/gallery/Imtiaz/photo${i + 1}.jpg`
        })),
        photographys: Array.from({ length: 16 }, (_, i) => ({
            id: i + 1,
            title: `Photography — Frame ${i + 1}`,
            src: `assets/gallery/Photographys/photo${i + 1}.jpg`
        }))
    };

    let activeFolder = 'imtiaz';

    function renderGalleryHTML() {
        const photos = galleryData[activeFolder];
        return `
      <div class="gallery-container">
        <!-- Sidebar Folder Navigation -->
        <div class="gallery-sidebar">
          <div class="gallery-sidebar-title">Folders</div>
          <button class="gallery-folder-btn ${activeFolder === 'imtiaz' ? 'active' : ''}" data-folder="imtiaz">
            <img src="assets/icons/folder.svg" class="folder-svg" alt="Folder" />
            <div class="folder-info">
              <span class="folder-name">Imtiaz</span>
              <span class="folder-count">15 Photos</span>
            </div>
          </button>
          
          <button class="gallery-folder-btn ${activeFolder === 'photographys' ? 'active' : ''}" data-folder="photographys">
            <img src="assets/icons/folder.svg" class="folder-svg" alt="Folder" />
            <div class="folder-info">
              <span class="folder-name">Photographys</span>
              <span class="folder-count">16 Photos</span>
            </div>
          </button>
        </div>

        <!-- Main Photo Grid (Uncropped / Natural Aspect Ratio) -->
        <div class="gallery-main">
          <div class="gallery-grid">
            ${photos.map(p => `
              <div class="gallery-item" data-src="${p.src}" data-title="${p.title}">
                <img src="${p.src}" alt="${p.title}" loading="lazy" onError="this.onerror=null;this.src='assets/sreemangal.jpg';" />
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Fullscreen Lightbox Modal -->
        <div id="gallery-lightbox" class="gallery-lightbox hidden">
          <button id="lightbox-close" class="lightbox-close-btn">&times;</button>
          <img id="lightbox-img" src="" alt="Full Preview" />
          <div id="lightbox-caption" class="lightbox-caption"></div>
        </div>
      </div>
    `;
    }

    wm.createWindow('gallery', 'Imtiaz\'s Gallery', renderGalleryHTML(), { width: '820px', height: '520px' });

    // Bind Event Listeners
    setTimeout(() => {
        const win = document.getElementById('win-gallery');
        if (!win) return;

        function attachGalleryEvents() {
            // 1. Switch Folders
            const folderBtns = win.querySelectorAll('.gallery-folder-btn');
            folderBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    activeFolder = btn.getAttribute('data-folder');
                    win.querySelector('.window-body').innerHTML = renderGalleryHTML();
                    attachGalleryEvents();
                });
            });

            // 2. Open Lightbox Widely
            const items = win.querySelectorAll('.gallery-item');
            const lightbox = win.querySelector('#gallery-lightbox');
            const lightboxImg = win.querySelector('#lightbox-img');
            const lightboxCap = win.querySelector('#lightbox-caption');
            const closeBtn = win.querySelector('#lightbox-close');

            items.forEach(item => {
                item.addEventListener('click', () => {
                    const src = item.getAttribute('data-src');
                    const title = item.getAttribute('data-title');
                    lightboxImg.src = src;
                    lightboxCap.textContent = title;
                    lightbox.classList.remove('hidden');
                });
            });

            // 3. Close Lightbox
            if (closeBtn && lightbox) {
                closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));
                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) lightbox.classList.add('hidden');
                });
            }
        }

        attachGalleryEvents();
    }, 100);
};