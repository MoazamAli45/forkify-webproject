import * as model from './model.js';
// import recipeView from './views/recipeview.js'; // can give any name as we are importing object

// polifyling evrything else
// import 'core-js/stable';
// polifilling async await
// import 'regenerator-runtime/runtime';
import recipeview from './recipeview.js';
import searchView from './searchView.js';
import resultsView from './resultsView.js';
import paginationView from './paginationView.js';
import bookmarksView from './bookmarksView.js';
import addRecipeView from './addRecipeView.js';
import { MODEL_CLOSE_SEC } from '../config.js';
// console.log(icons); // it is just a path to new file after parcel
// const recipeContainer = document.querySelector('.recipe');

// const timeout = function (s) {
//   return new Promise(function (_, reject) {
//     setTimeout(function () {
//       reject(new Error(`Request took too long! Timeout after ${s} second`));
//     }, s * 1000);
//   });
// };
// for parcel autorrefresh
if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
// async function
// adding markup
// we are using src icons as path is now changed

const controlRecipe = async function () {
  // url window.location
  try {
    // 'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    // `${API_URL}/${id}`
    // removing first character
    const id = window.location.hash.slice(1);
    // console.log(id);
    // console.log(window.location);

    // if not id
    if (!id) return;
    recipeview.renderSpinner();

    // 0) Update Results view to update  to mark selected search results
    resultsView.update(model.getSearchResultsPage()); // now no flickering
    // resultsView.render(model.getSearchResultsPage());

    //1) Updating bookmarks view
    // debugger;  to check code
    bookmarksView.update(model.state.bookmarks);
    // 2) Loading Recipe
    // passing a variable
    // async function return promise
    await model.loadRecipe(id);
    // console.log(model.state.recipe); // recipe will be loaded and stored in state
    // const { recipe } = model.state;

    //  3) Rendering Recipe
    /// using map so that is will return array and convert to string
    // object imported from recipeview
    // const recipeview = new recipeView(model.state.recipe); // also possible
    // console.log(model.state.recipe);
    recipeview.render(model.state.recipe);
  } catch (err) {
    // alert(err);
    // console.error(err);
    recipeview.renderError();
    console.error(err);
  }
};
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get Search Query
    const query = searchView.getQuery();
    // console.log(query);

    if (!query) return;
    // 2) Load Search Result
    await model.loadSearchResults(query);

    //3) render Results
    // console.log(model.state.search.result);
    // if (model.state.search.result.length == 0) alert('Item not Found!');
    // resultsView.render(model.state.search.result);
    // resultsView.render(model.getSearchResultsPage(1)); // if not pass means 1st page
    resultsView.render(model.getSearchResultsPage(1)); // if not pass means 1st page

    //  4) Render Initial pagination
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  //calling from pagination view
  // console.log(goToPage);
  // 1) Rendering new search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //  2) Render new pagination
  paginationView.render(model.state.search);
  console.log(model.state.search);
};
// updating servings
const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  recipeview.update(model.state.recipe); // only update the dome elements not image again load
};
// control for aadding bookmark
const controlAddBookmark = function () {
  // when recipe is not bookmarked
  // 1) Add/Remove Bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  // update the element only

  // 2) Update the recipe View
  recipeview.render(model.state.recipe);

  //3) Render the bookmarks
  bookmarksView.render(model.state.bookmarks); // data about bookmarks is passing
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
// when you upload the recipe
const controlAddRecipe = async function (newRecipe) {
  try {
    // Showing Spinner
    addRecipeView.renderSpinner();
    // console.log(newRecipe);

    // Upload teh new Recipe data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    /////////Rendering recipe
    recipeview.render(model.state.recipe);
    // SUCCESS Message
    addRecipeView.renderMessage();
    // Render Bookmark view
    // not using updtae because inserting new element
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    // this will change the url without reloading the page
    // history is APi
    // it  3 arguments (state,title,URL )
    window.history.pushState(null, ' ', `#${model.state.recipe.id}`);
    // automatically going to last page
    // window.history.back()
    // Close form after uploading
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODEL_CLOSE_SEC * 1000); // after 2.5 miliseconds // to convert into milli sec *1000
  } catch (err) {
    console.error('💣,err ');
    // addRecipeView.render()
    addRecipeView.renderError(err.message);
  }
};

// controlSearchResults();
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  // Publisher Subcriber pattern we dont want to export control Recipe
  recipeview.addHandlerRender(controlRecipe);
  recipeview.addHandlerUpdateServings(controlServings);
  recipeview.addHandlerBookmark(controlAddBookmark);

  // Publisher Subcriber pattern we dont want to export control search result
  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);
  //recipe Upload
  addRecipeView.addHnadlerUpload(controlAddRecipe);
  console.log('Welcome to application');
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
