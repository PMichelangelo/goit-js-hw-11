import { serviceSearchQuery } from './search.js';
import Notiflix from 'notiflix';

const refs = {
  form: document.querySelector('.search-form'),
  btn: document.querySelector('.search-btn'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.querySelector('.load-more')
};

refs.form.addEventListener("submit", handleSubmit);
refs.loadBtn.addEventListener("click", handleClick);

const apiKey = '19208174-4a8a1fc5d875fb3b1b47e04d4';

let currentPage = 1;
let totalPages = 0;
let isNotificationDisplayed = false;
let replaceGalerry = true;
let currentSearchQuery = '';

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const searchQuery = formData.get("searchQuery");

  if (searchQuery.trim() === "") {
    Notiflix.Notify.failure("Search query cannot be empty!");
    return;
  }

  currentSearchQuery = searchQuery;
  isNotificationDisplayed = false;
  replaceGalerry = true;

  currentPage = 1;
  await serviceSearchQuery(apiKey, refs, currentPage, totalPages, isNotificationDisplayed, replaceGalerry, currentSearchQuery);

  event.target.reset();
}

function handleClick() {
  currentPage += 1;
  serviceSearchQuery(apiKey, refs, currentPage, totalPages, isNotificationDisplayed, replaceGalerry, currentSearchQuery);
}