/* ============================================
   MORENO & SON LANDSCAPING — Gallery JS
   Lightbox + Category Filtering
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- GALLERY FILTERING ---------- */
  const filterButtons = document.querySelectorAll('.gallery__filter');
  const galleryItems = document.querySelectorAll('.gallery__item');

  if (filterButtons.length && galleryItems.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.dataset.filter;

        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.classList.remove('hidden');
            // Re-trigger fade animation
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
              });
            });
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ---------- LIGHTBOX ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentImages = [];
  let currentIndex = 0;

  // Get all visible gallery images
  const getVisibleImages = () => {
    return Array.from(document.querySelectorAll('.gallery__item:not(.hidden) img'));
  };

  // Open lightbox
  const openLightbox = (index) => {
    currentImages = getVisibleImages();
    currentIndex = index;

    if (currentImages.length === 0) return;

    lightboxImage.src = currentImages[currentIndex].src;
    lightboxImage.alt = currentImages[currentIndex].alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    lightboxImage.src = '';
  };

  // Navigate lightbox
  const navigateLightbox = (direction) => {
    currentImages = getVisibleImages();
    currentIndex += direction;

    if (currentIndex < 0) {
      currentIndex = currentImages.length - 1;
    } else if (currentIndex >= currentImages.length) {
      currentIndex = 0;
    }

    lightboxImage.style.opacity = '0';
    setTimeout(() => {
      lightboxImage.src = currentImages[currentIndex].src;
      lightboxImage.alt = currentImages[currentIndex].alt;
      lightboxImage.style.opacity = '1';
    }, 150);
  };

  // Click handlers for gallery items
  if (galleryItems.length && lightbox) {
    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Find the index among visible items
        const visibleItems = Array.from(document.querySelectorAll('.gallery__item:not(.hidden)'));
        const visibleIndex = visibleItems.indexOf(item);
        openLightbox(visibleIndex);
      });
    });

    // Close button
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    // Previous / Next
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    }

    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => navigateLightbox(1));
    }

    // Close on background click
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateLightbox(-1);
          break;
        case 'ArrowRight':
          navigateLightbox(1);
          break;
      }
    });

    // Touch/swipe support for lightbox
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeDistance = touchStartX - touchEndX;

      if (Math.abs(swipeDistance) > 50) {
        if (swipeDistance > 0) {
          // Swiped left — next
          navigateLightbox(1);
        } else {
          // Swiped right — prev
          navigateLightbox(-1);
        }
      }
    }, { passive: true });
  }

  // Smooth fade transition for lightbox image
  if (lightboxImage) {
    lightboxImage.style.transition = 'opacity 0.15s ease';
  }

});
