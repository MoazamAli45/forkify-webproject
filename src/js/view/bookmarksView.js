import icons from 'url:../../img/icons.svg';
// for search results
import View from './View.js';
class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';
  _generateMarkup() {
    console.log(this._data);

    return this._data.map(this._generateMarkupPreview).join('');
  }
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkupPreview(res) {
    const id = window.location.hash.slice(1); // for active
    console.log(res.id);

    return ` <li class="preview">
            <a class="preview__link  ${
              res.id === id ? 'preview__link--active' : ''
            }" href="#${res.id}">
              <figure class="preview__fig">
                <img src="${res.image}" alt="${res.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${res.title}</h4>
                <p class="preview__publisher">${res.publisher}</p>
                <div class="preview__user-generated${res.key ? '' : 'hidden'} ">
                <svg>
                   <use href="${icons}#icon-user"></use>
                </svg>
              </div>                
                   
              </div>
            </a>
          </li>`;
  }
}

export default new bookmarksView(); // by exporting this object we don't need to make instance manuaaly in controller class
