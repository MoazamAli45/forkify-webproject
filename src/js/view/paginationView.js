import icons from 'url:../../img/icons.svg';
// for search results
import View from './View.js';
class paginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    // Event Delegation
    this._parentElement.addEventListener('click', function (e) {
      // closest method search

      const btn = e.target.closest('.btn--inline');
      // console.log(e.target);
      // console.log(btn);
      if(!btn) return;
      const goToPage = +btn.dataset.goto;// converting to number
      // console.log(goToPage);

      handler(goToPage);// value passing to controller 
    });
  }
  _generateMarkup() {
    const currPage = this._data.page;
    // as in super class this._data=data and data is pass model.state.search. so we can excess result array
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage // in case of pizza 59/10 and then ceil to 6
    );
    // console.log(numPages);
    // console.log(this._data.page);

    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1) {
      // only forward
      return `<button data-goto="${
        currPage + 1
      }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button> `;
    }

    // Last page
    if (currPage === numPages && numPages > 1) {
      // return last page
      // to go back
      return `<button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>`;
    }
    // Other Pages
    // if total pages are one that case also
    if (currPage < numPages) {
      // return 'other Pages';
      return `<button data-goto="${
        currPage - 1
      }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>
    <button data-goto="${
      currPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
    `;
    }
    // Page 1 and there are no other pages
    // if no condition true then
    // return 'only 1 page';
    return ''; // if onle one page then go to no place
  }
}
export default new paginationView();
