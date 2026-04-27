/* Product overlay + small UI interactions */
(function () {
  const overlay = document.getElementById('product');
  const closeBtn = document.getElementById('close-product');
  const shopBtn = document.getElementById('shop-btn');
  const sizes = document.querySelectorAll('#sizes .size');
  const playBtn = document.getElementById('play-btn');

  window.openProduct = function () {
    overlay.classList.add('on');
    document.body.style.overflow = 'hidden';
    overlay.scrollTop = 0;
  };
  function closeProduct() {
    overlay.classList.remove('on');
    document.body.style.overflow = '';
  }
  if (shopBtn) shopBtn.addEventListener('click', window.openProduct);
  if (closeBtn) closeBtn.addEventListener('click', closeProduct);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('on')) closeProduct();
  });

  // size selection
  sizes.forEach(s => s.addEventListener('click', () => {
    sizes.forEach(x => x.classList.remove('sel'));
    s.classList.add('sel');
  }));

  // play button toggle
  if (playBtn) {
    let playing = false;
    playBtn.addEventListener('click', () => {
      playing = !playing;
      playBtn.innerHTML = playing
        ? '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M8 5v14l11-7z"/></svg>';
    });
  }
})();
