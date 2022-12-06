class searchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query= this._parentEl.querySelector('.search__field').value;
   this._clearInput();
   return query;
}
  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  // now handler is a call abck function
  addHandlerSearch(handler) {
    // either user enter or click the button submit means
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler(); // contro search result will run in controller
    });
  }
}
export default new searchView(); // exporting its instance
