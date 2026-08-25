window.initShowcaseApp = function () {
    const projects = [
        {
            id: 'portscanner',
            title: 'Port Scanner',
            category: 'Network & Security',
            tags: ['Python', 'Networking', 'CLI', 'Sockets'],
            description: 'A fast, multi-threaded network utility for scanning open ports, discovering active hosts, and mapping system vulnerabilities across local and remote targets.',
            images: [
                'assets/projects/portscanner1.png',
                'assets/projects/portscanner2.png',
                'assets/projects/portscanner3.png'
            ],
            github: 'https://github.com/not-imtiaz/port-scanner'
        },
        {
            id: 'dnslogger',
            title: 'DNS Logger',
            category: 'System & Security',
            tags: ['Python', 'DNS Protocol', 'Logging', 'Network Analysis'],
            description: 'A lightweight packet inspection tool that captures, parses, and logs real-time DNS queries and responses across network interfaces for security analysis.',
            images: [
                'assets/projects/dns1.png',
                'assets/projects/dns2.png',
                'assets/projects/dns3.png'
            ],
            github: 'https://github.com/not-imtiaz/dns-logger'
        },
        {
            id: 'imt',
            title: 'Imt - Personal Website',
            category: 'Personal Website',
            tags: ['Personal Website', 'WebOS', 'JavaScript', 'HTML/CSS'],
            description: 'A custom-built personal website and web-based operating system (WebOS) that showcases my projects, portfolio, and contact information in a unique, interactive desktop-like environment.',
            images: [
                'assets/projects/imt1.png',
                'assets/projects/imt2.png',
                'assets/projects/imt3.png'
            ],
            github: 'https://github.com/not-imtiaz/imt'
        }
    ];

    let selectedProjectIdx = 0;
    let activeImageIdx = 0;

    function renderAppContent() {
        const project = projects[selectedProjectIdx];
        return `
      <div class="showcase-container">
        <!-- Left: Project Selector Sidebar -->
        <div class="showcase-sidebar">
          <div class="showcase-sidebar-header">Projects (${projects.length})</div>
          <div class="showcase-project-list">
            ${projects.map((p, idx) => `
              <div class="showcase-item ${idx === selectedProjectIdx ? 'active' : ''}" data-index="${idx}">
                <div class="showcase-item-title">${p.title}</div>
                <div class="showcase-item-cat">${p.category}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Project Details & 3-Photo Viewer -->
        <div class="showcase-main">
          <!-- Main Photo View -->
          <div class="showcase-gallery-wrap">
            <img id="showcase-main-img" src="${project.images[activeImageIdx]}" alt="${project.title} Preview" />
            
            <!-- 3 Thumbnails -->
            <div class="showcase-thumbs">
              ${project.images.map((imgSrc, imgIdx) => `
                <div class="showcase-thumb ${imgIdx === activeImageIdx ? 'active' : ''}" data-imgidx="${imgIdx}">
                  <img src="${imgSrc}" alt="Preview ${imgIdx + 1}" />
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Project Meta -->
          <div class="showcase-details">
            <div class="showcase-title-row">
              <h2>${project.title}</h2>
              <a href="${project.github}" target="_blank" class="showcase-btn">GitHub Repo ↗</a>
            </div>
            <p class="showcase-desc">${project.description}</p>

            <div class="showcase-tags">
              ${project.tags.map(tag => `<span class="showcase-tag">${tag}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    }

    wm.createWindow('showcase', 'Project Showcase', renderAppContent(), { width: '780px', height: '480px' });

    // Event Handlers for Switching Projects & Photos
    setTimeout(() => {
        const win = document.getElementById('win-showcase');
        if (!win) return;

        function attachListeners() {
            // Switch Active Project
            const projectItems = win.querySelectorAll('.showcase-item');
            projectItems.forEach(item => {
                item.addEventListener('click', () => {
                    selectedProjectIdx = parseInt(item.getAttribute('data-index'));
                    activeImageIdx = 0;
                    win.querySelector('.window-body').innerHTML = renderAppContent();
                    attachListeners();
                });
            });

            // Switch Active Image Thumbnail
            const thumbs = win.querySelectorAll('.showcase-thumb');
            thumbs.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    activeImageIdx = parseInt(thumb.getAttribute('data-imgidx'));
                    const mainImg = win.querySelector('#showcase-main-img');
                    if (mainImg) mainImg.src = projects[selectedProjectIdx].images[activeImageIdx];

                    thumbs.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });
        }

        attachListeners();
    }, 100);
};