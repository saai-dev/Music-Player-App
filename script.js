/**
 * ========================================
 * GLASS MUSIC PLAYER - JavaScript
 * ========================================
 * A minimalist music player with glassmorphism design.
 * All files are self-contained in the music-player folder.
 * 
 * FOLDER STRUCTURE:
 * music-player/
 * ├── index.html
 * ├── styles.css
 * ├── script.js
 * └── songs/
 *     ├── song1.mp3      (audio file)
 *     ├── album1.jpg     (album artwork)
 *     ├── song2.mp3
 *     ├── album2.jpg
 *     └── ... (add more songs and artwork here)
 * 
 * HOW TO ADD YOUR OWN SONGS:
 * 1. Create the "songs" folder inside "music-player" if it doesn't exist
 * 2. Add your MP3 files (e.g., song1.mp3, song2.mp3, etc.)
 * 3. Add album artwork images (e.g., album1.jpg, album2.jpg, etc.)
 * 4. Update the playlist array below with your song details
 */

// ========================================
// PLAYLIST CONFIGURATION
// ========================================
// Add your songs here. Each song needs:
// - title: Song name
// - artist: Artist name  
// - album: Path to album artwork (in songs/ folder)
// - src: Path to audio file (in songs/ folder)

const playlist = [
  {
    title: "Rebel Saab",
    artist: "Raaja Saab",
    album: "songs/Rajasaab.jpg",
    src: "songs/Rebel_Saab.mp3"
  },
  {
    title: "Pattuma",
    artist: "Love Insurance Kompany",
    album: "songs/LIK.jpg",
    src: "songs/Pattuma.mp3"
  },
  {
    title: "Dheema",
    artist: "Love Insurance Kompany",
    album: "songs/LIK.jpg",
    src: "songs/Dheema.mp3"
  },
  {
    title: "Nuvvunte Chaley",
    artist: "Andhra King Taluka",
    album: "songs/andhra_king_taluka.jpg",
    src: "songs/Nuvvunte_Chaley.mp3"
  },
  {
    title: "Gehra Hua",
    artist: "Dhurandhar",
    album: "songs/Dhurandhar.jpeg",
    src: "songs/Gehra_Hua.mp3"
  },
  {
    title: "Ishq Jalakar",
    artist: "Dhurandhar",
    album: "songs/Dhurandhar.jpeg",
    src: "songs/Ishq_Jalakar.mp3"
  }
];

// ========================================
// DOM ELEMENTS
// ========================================

const audio = document.getElementById('audio');
const albumArt = document.getElementById('albumArt');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeIcon = document.getElementById('volumeIcon');
const volumeSvg = document.getElementById('volumeSvg');

// ========================================
// STATE VARIABLES
// ========================================

let currentTrackIndex = 0;
let isPlaying = false;
let previousVolume = 80;

// ========================================
// UTILITY FUNCTIONS
// ========================================

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Update the play/pause icon
 */
function updatePlayIcon() {
  if (isPlaying) {
    // Show pause icon
    playIcon.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    playBtn.setAttribute('aria-label', 'Pause');
  } else {
    // Show play icon
    playIcon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    playBtn.setAttribute('aria-label', 'Play');
  }
}

/**
 * Update volume icon based on level
 */
function updateVolumeIcon() {
  const volume = parseInt(volumeSlider.value);
  let path;
  
  if (volume === 0) {
    // Muted icon
    path = 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
  } else if (volume < 50) {
    // Low volume
    path = 'M7 9v6h4l5 5V4l-5 5H7zm7 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z';
  } else {
    // High volume
    path = 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
  }
  
  volumeSvg.innerHTML = `<path d="${path}"/>`;
}

// ========================================
// TRACK LOADING
// ========================================

/**
 * Load a track by index
 */
function loadTrack(index) {
  const track = playlist[index];
  
  // Update audio source
  audio.src = track.src;
  
  // Update UI
  albumArt.src = track.album;
  trackTitle.textContent = track.title;
  trackArtist.textContent = track.artist;
  
  // Reset progress
  progressFill.style.width = '0%';
  currentTimeEl.textContent = '0:00';
  durationEl.textContent = '0:00';
  
  // Load the audio
  audio.load();
}

// ========================================
// PLAYBACK CONTROLS
// ========================================

/**
 * Toggle play/pause
 */
function togglePlay() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
}

/**
 * Play next track
 */
function playNext() {
  currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) {
    audio.play();
  }
}

/**
 * Play previous track
 */
function playPrevious() {
  currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
  loadTrack(currentTrackIndex);
  if (isPlaying) {
    audio.play();
  }
}

/**
 * Seek to position in track
 * Fixed: Now properly resumes playback after seeking
 */
function seek(e) {
  // Only allow seeking if audio has loaded enough data
  if (!audio.duration || isNaN(audio.duration) || audio.readyState < 2) {
    return;
  }
  
  const rect = progressBar.getBoundingClientRect();
  const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  const seekTime = percent * audio.duration;
  
  // Store current playing state
  const wasPlaying = isPlaying;
  
  // Set the new time
  audio.currentTime = seekTime;
  
  // Resume playback if it was playing before
  if (wasPlaying) {
    audio.play().catch(() => {});
  }
}

/**
 * Toggle mute
 */
function toggleMute() {
  if (parseInt(volumeSlider.value) > 0) {
    previousVolume = volumeSlider.value;
    volumeSlider.value = 0;
    audio.volume = 0;
  } else {
    volumeSlider.value = previousVolume;
    audio.volume = previousVolume / 100;
  }
  updateVolumeIcon();
}

// ========================================
// EVENT LISTENERS
// ========================================

// Play/Pause button
playBtn.addEventListener('click', togglePlay);

// Next/Previous buttons
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrevious);

// Progress bar click to seek
progressBar.addEventListener('click', seek);

// Volume slider
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value / 100;
  updateVolumeIcon();
});

// Volume icon click to mute/unmute
volumeIcon.addEventListener('click', toggleMute);

// Audio events
audio.addEventListener('play', () => {
  isPlaying = true;
  updatePlayIcon();
});

audio.addEventListener('pause', () => {
  isPlaying = false;
  updatePlayIcon();
});

audio.addEventListener('ended', () => {
  playNext();
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

// Handle seek completion - ensures UI updates immediately after seeking
audio.addEventListener('seeked', () => {
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('timeupdate', () => {
  // Update progress bar
  const percent = (audio.currentTime / audio.duration) * 100;
  progressFill.style.width = `${percent}%`;
  
  // Update current time display
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Keyboard controls
document.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      playNext();
      break;
    case 'ArrowLeft':
      playPrevious();
      break;
    case 'ArrowUp':
      e.preventDefault();
      volumeSlider.value = Math.min(100, parseInt(volumeSlider.value) + 10);
      audio.volume = volumeSlider.value / 100;
      updateVolumeIcon();
      break;
    case 'ArrowDown':
      e.preventDefault();
      volumeSlider.value = Math.max(0, parseInt(volumeSlider.value) - 10);
      audio.volume = volumeSlider.value / 100;
      updateVolumeIcon();
      break;
    case 'KeyM':
      toggleMute();
      break;
  }
});

// ========================================
// INITIALIZATION
// ========================================

// Set initial volume
audio.volume = volumeSlider.value / 100;
updateVolumeIcon();

// Load first track
loadTrack(currentTrackIndex);
