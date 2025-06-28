let imageList = [];
let swiper;

// Tạo IP ngẫu nhiên
function generateRandomIP() {
  return Array(4).fill(0).map(() => Math.floor(Math.random() * 256)).join('.');
}

// Gọi API lấy ảnh
function fetchAnime(apiUrl, isCustom = false) {
  const headers = isCustom ? new Headers({ 'X-Forwarded-For': generateRandomIP() }) : undefined;

  fetch(apiUrl, { headers })
    .then(res => res.json())
    .then(data => {
      const imgUrl = data?.url || data?.images?.[0]?.url;
      if (!imgUrl) return;

      // Lưu và hiển thị ảnh
      imageList.unshift(imgUrl);
      const animeContainer = document.getElementById('animeContainer');
      const img = document.createElement('img');
      img.src = imgUrl;
      img.classList.add('animeImage');
      img.addEventListener('click', () => openViewer(imgUrl));
      animeContainer.insertBefore(img, animeContainer.firstChild);
    })
    .catch(err => console.error("Lỗi:", err));
}

// Mở Viewer
function openViewer(clickedUrl) {
  const swiperWrapper = document.getElementById('swiperWrapper');
  swiperWrapper.innerHTML = ''; // Xóa slide cũ

  imageList.forEach(url => {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';
    slide.innerHTML = `<img src="${url}" alt="image" />`;
    swiperWrapper.appendChild(slide);
  });

  // Hiện modal
  const modal = new bootstrap.Modal(document.getElementById('animeModal'));
  modal.show();

  // Init swiper
  if (swiper) {
    swiper.update();
    swiper.slideTo(imageList.indexOf(clickedUrl));
  } else {
    swiper = new Swiper(".mySwiper", {
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev"
      },
      pagination: {
        el: ".swiper-pagination",
        type: "fraction"
      },
    });
    swiper.slideTo(imageList.indexOf(clickedUrl));
  }
}

// Bắt sự kiện Load ảnh
document.getElementById('loadImageBtn').addEventListener('click', () => {
  const selector = document.getElementById('tagSelector');
  const selected = selector.selectedOptions[0];
  const tag = selected.value;

  if (tag === "vagina") {
    // Gọi API custom khi tag là vagina
    fetchAnime('https://nsfw-api-p302.onrender.com/h/image/search?q=pussy', true);
  } else {
    // Gọi API mặc định với tag thông thường
    fetchAnime(`https://api.waifu.im/search?included_tags=${tag}`);
  }
});

// Xóa toàn bộ ảnh
document.getElementById('clearBtn').addEventListener('click', () => {
  document.getElementById('animeContainer').innerHTML = '';
  imageList = [];
});

// Dark Mode Toggle
document.getElementById('menuBtn').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// Đóng modal pixel
document.getElementById('pixelCloseBtn').addEventListener('click', () => {
  const modalEl = document.getElementById('animeModal');
  const modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) modal.hide();
});
