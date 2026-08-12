/* ============================================================
   VIDEO LIGHTBOX MODAL MODULE (YOUTUBE & MP4 SUPPORT)
   ============================================================ */

export function initVideoModal() {
  const overlay = document.getElementById('video-modal');
  const closeBtn = document.getElementById('modal-close');

  if (!overlay || !closeBtn) return;

  closeBtn.addEventListener('click', closeVideoModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeVideoModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeVideoModal();
    }
  });
}

export function openVideoModal(mediaSource, title = '') {
  const overlay = document.getElementById('video-modal');
  const wrapper = document.getElementById('modal-video-wrapper');

  if (!overlay || !wrapper) return;

  let embedHtml = '';

  // Check if mediaSource is YouTube ID or YouTube Link
  let youtubeId = '';
  if (mediaSource.includes('youtu.be/')) {
    youtubeId = mediaSource.split('youtu.be/')[1].split('?')[0];
  } else if (mediaSource.includes('youtube.com/watch?v=')) {
    youtubeId = mediaSource.split('v=')[1].split('&')[0];
  } else if (!mediaSource.includes('/') && mediaSource.length >= 8) {
    youtubeId = mediaSource;
  }

  if (youtubeId) {
    embedHtml = `
      <iframe
        src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1"
        title="${title || 'Victory Empire Production Video'}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="width: 100%; height: 100%; border: none;">
      </iframe>
    `;
  } else {
    embedHtml = `
      <video src="${mediaSource}" controls autoplay playsinline style="width:100%; height:100%; object-fit:contain; background:#000;">
        Your browser does not support video playback.
      </video>
    `;
  }

  wrapper.innerHTML = embedHtml;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeVideoModal() {
  const overlay = document.getElementById('video-modal');
  const wrapper = document.getElementById('modal-video-wrapper');

  if (!overlay || !wrapper) return;

  overlay.classList.remove('active');
  wrapper.innerHTML = '';
  document.body.style.overflow = 'auto';
}
