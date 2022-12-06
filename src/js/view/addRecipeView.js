import icons from 'url:../../img/icons.svg';
// for search results
import View from './View.js';
class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was Successfully Uploaded';

  _windowEl = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');

  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this.addhandlerClose();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._windowEl.classList.toggle('hidden');
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener(
      'click',
      this.toggleWindow.bind(this)
      // in eevent handler this shows the element that is attached to in this case btn open

      // this._overlay.classList.toggle('hidden');
      // this._window.classList.toggle('hidden');
      // to work we are using bind method and made another method
      // now point to correct object
    );
  }

  addhandlerClose() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    // by clicking on outside
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  // when click on upload button
  addHnadlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      // browser Api
      // as we are in handler function so this points to parent element
      // spread object into array

      const dataArray = [...new FormData(this)];

      // New Method to convert array to objject
      // Es2019 Method
      const data = Object.fromEntries(dataArray);
        // console.log(data);
      handler(data);
    });
  }

  _generateMarkup() {}
}
export default new addRecipeView();
