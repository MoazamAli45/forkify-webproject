import icons from 'url:../../img/icons.svg';
// Super Class
export default class View {
  _data;
  // public
  ////////////JS Documentation
  /**
   * Render received Data to DOM
   * @param {Object | Object[]} data  The data to be rendered(eg recipe)
   * @returns   {undefined | string}
   * @this {object}  View instance
   *@ Syed Moazam Ali
   *@todo Finsih Implemnetation
   */

  render(data) {
    // check data exist
    // On Array method this isArray method also exist to check array
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data; // recipe data
    const markup = this._generateMarkup();
    this._clear();
    /// adding on UI
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    // if (!data || (Array.isArray(data) && data.length === 0))
    //   return this.renderError();
    this._data = data; // recipe data
    const newMarkup = this._generateMarkup();

    /// commparing HTMl Elements
    // convert string inot real node objects
    // virtual dome
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*')); // elements change

    const currElements = Array.from(this._parentElement.querySelectorAll('*'));
    console.log(newElements, currElements);

    ////////////////////Changing DOM where just text and attribute cahnge
    // for only values to change
    newElements.forEach((newEl, i) => {
      const curEl = currElements[i];
      console.log(curEl, newEl.isEqualNode(curEl));
      // firstchild also return a node
      // check for only text
      // Update Changed Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        console.log('Number', newEl.firstChild.nodeValue.trim()); // check number
        curEl.textContent = newEl.textContent;
      }
      // Update Changed Attribute

      if (!newEl.isEqualNode(curEl)) {
        console.log(Array.from(newEl.attributes));

        // console.log(newEl.attributes)   // all the attributes that changed
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    // In start remove the message form UI
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `<div class="spinner">
         <svg>
           <use href="${icons}#icon-loader"></use>
         </svg>
       </div>`;
    // in start empty
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // default message
  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  // success message
  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div >
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
