/* Minimal brand splash — auto-redirect to home */

export function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  document.body.classList.add('intro-active');

  const dismiss = () => {
    intro.classList.add('intro-hidden');
    document.body.classList.remove('intro-active');
    window.dispatchEvent(new Event('scroll'));
  };

  setTimeout(dismiss, 2800);
}
