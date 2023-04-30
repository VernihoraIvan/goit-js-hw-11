import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const KEY = '35921971-1e573a853b9182cbe66d281b3';
const URL = 'https://pixabay.com/api/';

const refs = {
  form: document.querySelector('#search-form'),
  input: document.querySelector('input'),
  gallery: document.querySelector('.gallery'),
};

class GalleryApiService {
  constructor() {
    this.name = '';
    this.page = 1;
    this.perPage = 40;
    this.totalPages = 0;
  }

  async getImages() {
    try {
      const response = await axios.get(`${URL}`, {
        params: {
          key: `${KEY}`,
          q: `${this.name}`,
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: 'true',
          per_page: `${this.perPage}`,
          page: `${this.page}`,
        },
      });
      this.incrementPage();
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get getName() {
    return this.name;
  }
  set setName(newName) {
    this.name = newName;
  }

  set setTotalPages(newTotalPages) {
    this.totalPages = newTotalPages;
  }
}
const galleryApiService = new GalleryApiService();
/////////////////////////////////////////////////////////////////////////////////////////////

const onSearch = async e => {
  e.preventDefault();
  galleryApiService.name = refs.input.value.trim();
  galleryApiService.resetPage();

  if (galleryApiService.name === '') {
    return Notify.failure('Please input valid name');
  }

  try {
    const response = await galleryApiService.getImages();
    refs.gallery.innerHTML = '';
    // smoothScroll();

    galleryApiService.totalPages = Math.ceil(
      response.data?.totalHits / response.config.params.per_page
    );

    if (response.data.hits.length === 0) {
      // addHideClass(buttonMore);
      observer.unobserve(endOfGallery);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (
      galleryApiService.page > galleryApiService.totalPages ||
      response.data.totalHits < galleryApiService.perPage
    ) {
      // addHideClass(buttonMore);
      observer.unobserve(endOfGallery);
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      Notify.success(`Hooray! We found ${response.data.totalHits} images`);
      // buttonMore.classList.remove('hide');
      observer.observe(endOfGallery);
    }

    insertContent(response.data.hits);
  } catch (error) {
    console.log(error);
  }
};

refs.form.addEventListener('submit', onSearch);
