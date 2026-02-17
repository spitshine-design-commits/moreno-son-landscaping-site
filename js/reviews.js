/* ============================================
   REVIEWS CAROUSEL
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('reviewsTrack');
  if (!track) return;

  const cards = Array.from(track.children);
  const prevBtn = document.querySelector('.reviews__arrow--prev');
  const nextBtn = document.querySelector('.reviews__arrow--next');

  let currentIndex = 0;
  let autoPlayInterval = null;
  const autoPlayDelay = 5000;

  const getVisibleCount = () => {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  };

  const getMaxIndex = () => {
    return Math.max(0, cards.length - getVisibleCount());
  };

  const updateTrack = () => {
    const visibleCount = getVisibleCount();
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const wrapperWidth = track.parentElement.offsetWidth;
    const cardWidth = (wrapperWidth - gap * (visibleCount - 1)) / visibleCount;
    const offset = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${offset}px)`;
  };

  const goTo = (index) => {
    const maxIndex = getMaxIndex();
    if (index > maxIndex) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = maxIndex;
    } else {
      currentIndex = index;
    }
    updateTrack();
  };

  const goNext = () => goTo(currentIndex + 1);
  const goPrev = () => goTo(currentIndex - 1);

  if (nextBtn) nextBtn.addEventListener('click', () => {
    goNext();
    resetAutoPlay();
  });

  if (prevBtn) prevBtn.addEventListener('click', () => {
    goPrev();
    resetAutoPlay();
  });

  const startAutoPlay = () => {
    autoPlayInterval = setInterval(goNext, autoPlayDelay);
  };

  const stopAutoPlay = () => {
    clearInterval(autoPlayInterval);
  };

  const resetAutoPlay = () => {
    stopAutoPlay();
    startAutoPlay();
  };

  const carousel = document.querySelector('.reviews__carousel');
  if (carousel) {
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
  }

  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoPlay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchStartX - touchEndX;

    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    startAutoPlay();
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (currentIndex > getMaxIndex()) {
        currentIndex = getMaxIndex();
      }
      updateTrack();
    }, 150);
  });

  updateTrack();
  startAutoPlay();
});