import axios from "axios"
import Notiflix from "notiflix"
import SimpleLightbox from "simplelightbox"
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.querySelector('.search-form'),
  btn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more')
}


refs.form.addEventListener("submit", handleSubmit)
refs.loadBtn.addEventListener("click", handleClick)

const apiKey = '19208174-4a8a1fc5d875fb3b1b47e04d4'

let currentPage = 1;
let totalPages = 0;
let isNotificationDisplayed = false;
let replaceGalerry = true;


async function serviceSearchQuery(searchQuery, page = 1) {
  const perPageValue = 40;
  try {
    const res = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPageValue
      },
    });

    const totalHits = res.data.totalHits
    const images = res.data.hits;
    totalPages = Math.ceil(res.data.totalHits / 40)

     if (!isNotificationDisplayed) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      isNotificationDisplayed = true;
    }

    if (replaceGalerry) {
      clearGallery()
      replaceGalerry = false;
    }

    createMarkup(images);
    checkLoadMoreButton();

  } catch (error) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.")
  }
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function handleClick() {
  currentPage += 1;
  const formData = new FormData(refs.form)
  const searchQuery = formData.get("searchQuery")

  serviceSearchQuery(searchQuery, currentPage)
}

function checkLoadMoreButton() {
  if (currentPage < totalPages) {
    refs.loadBtn.style.display = 'block';
  } else {
    refs.loadBtn.style.display = 'none';
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}


async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const searchQuery = formData.get("searchQuery");


  if (searchQuery.trim() !== "") {
    isNotificationDisplayed = false;
    replaceGalerry = true;
    await serviceSearchQuery(searchQuery);
  } else {
    Notiflix.Notify.failure("Search query cannot be empty!")
  }

currentPage = 1;
  serviceSearchQuery(searchQuery);

  event.target.reset()
}

const galleryService = new SimpleLightbox('.gallery_link', {
  captions: true,
  captionsData: "alt",
  captionDelay: 250,
});


function createMarkup(arr) {
  const markup = arr.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card">
    <a class="gallery_link" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <b>${likes}</b>
      </p>
      <p class="info-item">
        <b>Views</b>
        <b>${views}</b>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <b>${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <b>${downloads}</b>
      </p>
  </div>
</div>`
  }).join("")

  refs.gallery.innerHTML += markup;

  galleryService.refresh();
};

