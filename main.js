let imageList = [];
let swiper;

function generateRandomIP() {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
}

function fetchAnime(apiUrl, isCustom = false) {
  const headers = isCustom ? new Headers({ 'X-Forwarded-For': generateRandomIP() }) : undefined;

  fetch(apiUrl, { headers })
    .then(res => res.json())
    .then(data => {
      const imgUrl = data?.url || data?.images?.[0]?.url;
      if (!imgUrl) return;

      // Save to image list
      imageList.unshift(imgUrl);

      // Display thumbnail
      const animeContainer = document.getElementById('animeContainer');
      const img = document.createElement('img');
      img.src = imgUrl;
      img.classList.add('animeImage');
      img.addEventListener('click', () => openViewer(imgUrl));
      animeContainer.insertBefore(img, animeContainer.firstChild);
    })
    .catch(err => console.error("Lỗi:", err));
}

function openViewer(clickedUrl) {
  const swiperWrapper = document.getElementById('swiperWrapper');
  swiperWrapper.innerHTML = ''; // Clear slides

  imageList.forEach(url => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${url}" alt="image" />`;
    swiperWrapper.appendChild(slide);
  });

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('animeModal'));
  modal.show();

  // Init or update swiper
  if (swiper) {
    swiper.update();
    swiper.slideTo(imageList.indexOf(clickedUrl));
  } else {
    swiper = new Swiper(".mySwiper", {
      loop: false,
      navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
      pagination: { el: ".swiper-pagination", type: "fraction" },
    });
    swiper.slideTo(imageList.indexOf(clickedUrl));
  }
}

// Load image from dropdown
document.getElementById('loadImageBtn').addEventListener('click', () => {
  const selector = document.getElementById('tagSelector');
  const selected = selector.selectedOptions[0];
  const tag = selected.value;
  const isCustom = selected.dataset.custom === "true";

  if (isCustom && tag === "vagina") {
    fetchAnime('https://apiquockhanh.click/images/lon', true);
  } else {
    fetchAnime(`https://api.waifu.im/search?included_tags=${tag}`);
  }
});

// Clear all
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('animeContainer').innerHTML = '';
  imageList = [];
});

// Toggle dark mode
document.getElementById('menuBtn').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});
// Nút đóng pixel-style
document.getElementById('pixelCloseBtn').addEventListener('click', () => {
  const modalEl = document.getElementById('animeModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
});
