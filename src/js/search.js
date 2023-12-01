import axios from "axios";
import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { createMarkup } from './gallery.js';

const PER_PAGE = 40;

export async function serviceSearchQuery(apiKey, refs, currentPage, totalPages, isNotificationDisplayed, replaceGallery, currentSearchQuery) {
  if (currentSearchQuery.trim() === "") {
    Notiflix.Notify.failure("Search query cannot be empty!");
    return;
  }

  try {
    const res = await axios.get('https://pixabay.com/api/', {
      params: {
        key: apiKey,
        q: currentSearchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: currentPage,
        per_page: PER_PAGE
      },
    });

    handleResponse(res.data, refs, currentPage, totalPages, isNotificationDisplayed, replaceGallery);

  } catch (error) {
    handleError();
  }
}

function handleResponse(data, refs, currentPage, totalPages, isNotificationDisplayed, replaceGallery) {
  const totalHits = data.totalHits;
  const images = data.hits;
  totalPages = Math.ceil(totalHits / PER_PAGE);

  if (replaceGallery && currentPage === 1) {
    clearGallery(refs);
    replaceGallery = false;
  }

  if (images.length === 0 && currentPage === 1 && !isNotificationDisplayed) {
    Notiflix.Notify.info("Sorry, there are no images matching your search query. Please try again.");
    isNotificationDisplayed = true;
    return;
  }

  if (totalHits === 0 && currentPage > 1 && !isNotificationDisplayed) {
    Notiflix.Notify.info("Sorry, there are no more images matching your search query. Please try again.");
    isNotificationDisplayed = true;
  } else if (!isNotificationDisplayed && currentPage === 1) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
    isNotificationDisplayed = true;
  }

  const galleryService = new SimpleLightbox('.gallery_link', {
    captions: true,
    captionsData: "alt",
    captionDelay: 250,
  });

  const markup = createMarkup(images);
  refs.gallery.innerHTML += markup;

  galleryService.refresh();
  checkLoadMoreButton(refs, currentPage, totalPages, isNotificationDisplayed, replaceGallery);
}

function handleError() {
  Notiflix.Notify.failure("Sorry, there was an error while fetching images. Please try again.");
}

function clearGallery(refs) {
  refs.gallery.innerHTML = '';
}

function checkLoadMoreButton(refs, currentPage, totalPages, isNotificationDisplayed, replaceGallery) {
  const loadBtn = refs.loadBtn;

  loadBtn.style.display = currentPage < totalPages ? 'block' : 'none';

  if (currentPage === totalPages && totalPages > 1) {
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  }
}