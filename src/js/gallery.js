export function createMarkup(arr) {
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
  </div>`;
  }).join("");

  return markup;
}