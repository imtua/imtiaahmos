window.initMediaPlayerApp = function () {
    const playlist = [
        { title: 'American Boy', artist: "Estelle & Kanye West", src: 'assets/musics/track1.mp3', cover: "assets/music_covers/track1.png" },
        { title: 'Bad Habit', artist: "Steve Lacy", src: 'assets/musics/track2.mp3', cover: "assets/music_covers/track2.png" },
        { title: 'Bound 2', artist: "Kanye West", src: 'assets/musics/track3.mp3', cover: "assets/music_covers/track3.png" },
        { title: "Chamber of Reflection", artist: "Mac DeMarco", src: 'assets/musics/track4.mp3', cover: "assets/music_covers/track4.png" },
        { title: 'Chicago', artist: "Michael Jackson", src: 'assets/musics/track5.mp3', cover: "assets/music_covers/track5.png" },
        { title: "Confidence", artist: "Kim", src: 'assets/musics/track6.mp3', cover: "assets/music_covers/track6.png" },
        { title: "Dark Red", artist: "Steve Lacy", src: 'assets/musics/track7.mp3', cover: "assets/music_covers/track7.png" },
        { title: "Duvet", artist: "Bôa", src: 'assets/musics/track8.mp3', cover: "assets/music_covers/track8.png" },
        { title: "Flashing Lights", artist: "Kanye West", src: 'assets/musics/track9.mp3', cover: "assets/music_covers/track9.png" },
        { title: "For the First Time", artist: "Mac DeMarco", src: 'assets/musics/track10.mp3', cover: "assets/music_covers/track10.png" },
        { title: "From the Start", artist: "Laufey", src: 'assets/musics/track11.mp3', cover: "assets/music_covers/track11.png" },
        { title: "Genseng Strip 2002", artist: "Yung Lean", src: 'assets/musics/track12.mp3', cover: "assets/music_covers/track12.png" },
        { title: "Headlock", artist: "Imogen Heap", src: 'assets/musics/track13.mp3', cover: "assets/music_covers/track13.png" },
        { title: "I Wonder", artist: "Kanye West", src: 'assets/musics/track15.mp3', cover: "assets/music_covers/track15.png" },
        { title: "Ice", artist: "Zertal", src: 'assets/musics/track14.mp3', cover: "assets/music_covers/track14.png" },
        { title: "Let it Happen", artist: "Tame Impala", src: 'assets/musics/track16.mp3', cover: "assets/music_covers/track16.png" },
        { title: "Like Him", artist: "Tyler, the Creator", src: 'assets/musics/track17.mp3', cover: "assets/music_covers/track17.png" },
        { title: "Lover Girl", artist: "Laufey", src: 'assets/musics/track18.mp3', cover: "assets/music_covers/track18.png" },
        { title: "New Person, Same Old Mistakes", artist: "Tame Impala", src: 'assets/musics/track19.mp3', cover: "assets/music_covers/track19.png" },
        { title: "See you again", artist: "Tyler, the Creator", src: 'assets/musics/track20.mp3', cover: "assets/music_covers/track20.png" },
        { title: "Tek it", artist: "Cafune", src: 'assets/musics/track21.mp3', cover: "assets/music_covers/track21.png" },
        { title: "The Less I Know the Better", artist: "Tame Impala", src: 'assets/musics/track22.mp3', cover: "assets/music_covers/track22.png" },
    ];

    let currentTrackIdx = 0;

    const playerHTML = `
    <div class="player-container">
      <audio id="audio-element" src="${playlist[0].src}"></audio>
      
      <!-- Left: Now Playing Card -->
      <div class="player-main">
        <div class="album-art-wrap">
          <img id="player-cover" src="${playlist[0].cover}" alt="Album Art" />
        </div>
        <div class="track-meta">
          <h3 id="player-title">${playlist[0].title}</h3>
          <p id="player-artist">${playlist[0].artist}</p>
        </div>

        <!-- Progress Bar -->
        <div class="progress-wrap">
          <span id="current-time">0:00</span>
          <input type="range" id="progress-bar" value="0" min="0" max="100" />
          <span id="total-duration">0:00</span>
        </div>

        <!-- Controls -->
        <div class="player-controls">
            <button id="btn-prev" class="ctrl-btn" title="Previous">
                <img src="assets/icons/media/prev.svg" class="player-svg" alt="Previous" />
            </button>
            <button id="btn-play" class="ctrl-btn play-btn" title="Play/Pause">
                <img src="assets/icons/media/plau.svg" class="player-svg" alt="Play" />
            </button>
            <button id="btn-next" class="ctrl-btn" title="Next">
                <img src="assets/icons/media/next.svg" class="player-svg" alt="Next" />
             </button>
        </div>
      </div>

      <div class="player-playlist">
        <h4>Playlist (${playlist.length})</h4>
        <ul id="playlist-list">
          ${playlist.map((track, i) => `
            <li class="playlist-item ${i === 0 ? 'active' : ''}" data-index="${i}">
              <span class="track-num">${i + 1 < 10 ? '0' + (i + 1) : i + 1}</span>
              <span class="track-name">${track.title}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    </div>
  `;

    wm.createWindow('mediaplayer', 'Media Player', playerHTML, { width: '700px', height: '400px' });

    setTimeout(() => {
        const audio = document.getElementById('audio-element');
        const playBtn = document.getElementById('btn-play');
        const prevBtn = document.getElementById('btn-prev');
        const nextBtn = document.getElementById('btn-next');
        const progressBar = document.getElementById('progress-bar');
        const currentTimeEl = document.getElementById('current-time');
        const totalDurationEl = document.getElementById('total-duration');
        const playlistItems = document.querySelectorAll('.playlist-item');

        if (!audio) return;

        function loadTrack(index) {
            currentTrackIdx = index;
            const track = playlist[index];
            audio.src = track.src;
            document.getElementById('player-title').textContent = track.title;
            document.getElementById('player-artist').textContent = track.artist;
            document.getElementById('player-cover').src = track.cover;

            playlistItems.forEach(item => item.classList.remove('active'));
            const activeItem = document.querySelector(`.playlist-item[data-index="${index}"]`);
            if (activeItem) activeItem.classList.add('active');

            audio.play();
            playBtn.innerHTML = '<img src="assets/icons/media/pause.svg" class="player-svg" alt="Pause">';
        }

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = '<img src="assets/icons/media/pause.svg" class="player-svg" alt="Pause">';
            } else {
                audio.pause();
                playBtn.innerHTML = '<img src="assets/icons/media/plau.svg" class="player-svg" alt="Play">';
            }
        });

        prevBtn.addEventListener('click', () => {
            currentTrackIdx = (currentTrackIdx - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIdx);
        });

        nextBtn.addEventListener('click', () => {
            currentTrackIdx = (currentTrackIdx + 1) % playlist.length;
            loadTrack(currentTrackIdx);
        });

        playlistItems.forEach(item => {
            item.addEventListener('click', () => {
                const idx = parseInt(item.getAttribute('data-index'));
                loadTrack(idx);
            });
        });

        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const pct = (audio.currentTime / audio.duration) * 100;
                progressBar.value = pct;
                currentTimeEl.textContent = formatTime(audio.currentTime);
                totalDurationEl.textContent = formatTime(audio.duration);
            }
        });

        progressBar.addEventListener('input', () => {
            if (audio.duration) {
                const seekTime = (progressBar.value / 100) * audio.duration;
                audio.currentTime = seekTime;
            }
        });

        function formatTime(sec) {
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m}:${s < 10 ? '0' : ''}${s}`;
        }

    }, 100);


};