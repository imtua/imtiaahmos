window.initContactApp = function () {
    const contactLinks = [
        { name: 'Email', handle: 'imtiaz.synthetics@gmail.com', href: 'mailto: imtiazyt.ia@gmail.com', icon: 'assets/icons/contact/mail.svg', copyable: true },
        { name: 'Github', handle: 'github.com/imtua', href: "https://github.com/imtua", icon: 'assets/icons/contact/github.svg', copyable: false },
        { name: 'LinkedIn', handle: 'linkedin.com/in/imtiaahm', href: 'https://www.linkedin.com/in/imtiaahm/', icon: 'assets/icons/contact/linkedin.svg', copyable: false },
        { name: 'Instagram', handle: '@gimmeimti', href: 'https://www.instagram.com/gimmeimti/', icon: 'assets/icons/contact/instagram.svg', copyable: false },
        { name: 'Discord', handle: 'imtiaahm', href: '#', copyable: true, icon: 'assets/icons/contact/discord.svg' },
    ];

    const contactHTML = `
    <div class="contact-container">
      <!-- Profile Overview Header -->
      <div class="contact-profile">
        <div class="contact-avatar">
          <img src="assets/icon.jpg" alt="Imtiaz Ahmed" />
        </div>
        <div class="contact-info">
          <h3>Imtiaz Ahmed</h3>
          <p>Founder & Full-Stack Developer</p>
          <span class="contact-status-badge">Available for projects</span>
        </div>
      </div>

      <!-- Social & Direct Links Grid -->
      <div class="contact-grid">
        ${contactLinks.map(link => `
          <div class="contact-card">
            <span class="contact-icon">
              <img src="${link.icon}" alt="${link.name} icon" />
            </span>
            <div class="contact-details">
              <span class="contact-name">${link.name}</span>
              <span class="contact-handle">${link.handle}</span>
            </div>
            <div class="contact-actions">
              ${link.copyable ? `<button class="contact-btn copy-btn" data-copy="${link.handle}" title="Copy to clipboard">📋</button>` : ''}
              ${link.href !== '#' ? `<a href="${link.href}" target="_blank" class="contact-btn link-btn" title="Open Link">↗</a>` : ''}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Quick Message Note -->
      <div class="contact-footer-note">
        <span>Preferred method: GitHub or Email for project inquiries.</span>
      </div>
    </div>
  `;

    wm.createWindow('contact', 'Get In Touch', contactHTML, { width: '480px', height: '490px' });
    setTimeout(() => {
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const textToCopy = btn.getAttribute('data-copy');
                navigator.clipboard.writeText(textToCopy);
                const originalText = btn.textContent;
                btn.textContent = 'Copied';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1500);
            });
        });
    }, 100);
}