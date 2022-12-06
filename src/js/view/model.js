import { async } from 'regenerator-runtime';

import { API_URL } from '../config.js';
// import { getJSON, sendJSON } from '../helpers.js';
import { AJAX } from '../helpers.js';
import { RES_PER_PAGE, KEY } from '../config.js';
// Entire Model
// export for used in controller
// state contain all data
export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
    page: 1, //default
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [], // totore bokkmarks data
};
// converting objrct into our name used in this site
const recipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    // for uploading key exist so
    ...(recipe.key && { key: recipe.key }), // if recipe.key true then second condition will run and retunr object and by destructing we are getting values
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);
    console.log(`${API_URL}/${id}?key=${KEY}`);
    console.log(data);
    // console.log(res, data);
    // data inside data destruct recipe
    // const { recipe } = data.data;
    // // console.log(recipe);
    // // changing inside objects
    // state.recipe = {
    //   id: recipe.id,
    //   title: recipe.title,
    //   publisher: recipe.publisher,
    //   sourceUrl: recipe.source_url,
    //   image: recipe.image_url,
    //   servings: recipe.servings,
    //   cookingTime: recipe.cooking_time,
    //   ingredients: recipe.ingredients,
    // };
    // Now this will be done using function
    state.recipe = recipeObject(data);

    // console.log(state.recipe);
    // check if bookmarked recipe then
    // when we again come again that must be bookmarked
    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    // Temporary Error Hnadling
    console.error(`${err} 💣💣💣`);
    // we have to throw again to reject promise
    throw err;
  }
};
//////Search result
export const loadSearchResults = async function (query) {
  try {
    // storing all data in state
    state.search.query = query;

    // return promise data
    // load all recipes with our recipe as well

    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    console.log(data);
    // changing object name
    state.search.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        // for uploading key exist so
        ...(rec.key && { key: rec.key }),
      };
    });
    /// so when next time again search  page again default
    state.search.page = 1;

    // console.log(state.search.result);
  } catch (err) {
    // Temporary Error Hnadling
    console.error(`${err} 💣💣💣`);
    // we have to throw again to reject promise so that it can be access in controller
    throw err;
  }
};
// Pagination
export const getSearchResultsPage = function (page = state.search.page) {
  // default page=1
  // if page 1 then start 0
  // console.log(state.s earch.page);
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //0 *10
  const end = page * state.search.resultsPerPage; //10
  // console.log(state.search.result);
  const numObjects = state.search.result.slice(start, end); // in this array we are getting 0 to 10 objects

  return numObjects;
};
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const updateServings = function (newServings) {
  // quantity increase with servings
  // console.log(state.recipe.ingredients);

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    //new qunatity =oldQt * newServings/oldServings // 2* 8/4 =4 if servings double
  });

  // Servings also update
  state.recipe.servings = newServings;
};
/// Bookmark
export const addBookmark = function (recipe) {
  // add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as Bookmark
  // check if book mark recipe and the recipe that is loaded same then create new object and set it to true
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  // console.log(state.recipe);
  persistBookmarks();
};
// Unmark Bookmark
export const deleteBookmark = function (id) {
  // index will be stored
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/// Local Storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  // converting data coming from local storage to objects
  if (storage) state.bookmarks = JSON.parse(storage);
};
// geting form local Storage
init();
// console.log(state.bookmarks);

// uplodaing recipe
export const uploadRecipe = async function (newRecipe) {
  try {
    console.log(newRecipe);
    // making array Object convert beck to array
    // checking for 1st element should start with ingredient and not empty
    const ingredients = Object.entries(newRecipe)
      .filter(
        entry => entry[0].startsWith('ingredient') && entry[1] !== ''
        // after filtering
      )
      .map(ing => {

        const ingArray = ing[1].split(',').map(el => el.trim());
        // const ingArray = ing[1].replaceAll(' ','').split(',');
        const [quantity, unit, description] = ingArray; // split convert string  to array

        if (ingArray.length !== 3)
          throw Error(
            'Wrong Ingredient format:) Please Use the correct Format:) '
          );
        // qunatity should be number

        return { quantity: quantity ? +quantity : null, unit, description }; // then returning object
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    // ? to specify a list of parameter
    // this will send back data
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    console.log(data);

    // console.log(recipe);
    ////////////After uplodaing data stored in state
    state.recipe = recipeObject(data);

    /// Adding into bookmark
    addBookmark(state.recipe);
    console.log(state);

    /// Just for uploading then key will be added
  } catch (err) {
    throw err;
  }
};
