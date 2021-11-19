import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

///////////////////////////////////////

const controlRecipe = async function () {
  try {
    // Get current recipe through URL
    const id = window.location.hash.slice(1);
    if (!id) return;

    // Render spinner
    recipeView.renderSpinner();

    // Update result view to mark selected search result
    resultView.update(model.getSearchResultPage());

    // Load recipe data from API
    await model.loadRecipe(id);

    // Update bookmark (Put this after the 'await model.loadRecipe(id);' because we don't want this to execute before the render method down there 'bookmarkView.render(model.state.bookmarks);'. We put this here for this to wait for the 'await model.loadRecipe(id);'. I mean, killing time :)) )

    // Yeah I found a better way which is but 'bookmarkView.render(model.state.bookmarks);' BEFORE 'recipeView.addHandlerRender(controlRecipe);' for the RENDER method HAPPEN BEFORE the UPDATE
    bookmarkView.update(model.state.bookmarks);

    // Render that recipe in recipe view
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(`${err} ⛔⛔⛔`); // temp. It's used to determine which error occurred to fix properly
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    // Get query keyword from user
    const query = searchView.getQuery();
    if (!query) return;

    // Render spinner
    resultView.renderSpinner();

    // Load all the recipes match the query keyword
    await model.loadSearchResult(query);

    // Render the first 10 recipes to the recipe view
    resultView.render(model.getSearchResultPage());

    // Render the pagination accordingly to the current page which is set in the previous step.
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(`${err} ⛔⛔⛔`); // temp. It's used to determine which error occurred to fix properly
    resultView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // Render the NEW 10 recipes to the recipe view accordingly to goToPage
  resultView.render(model.getSearchResultPage(goToPage));

  // Render the NEW pagination accordingly to the current page which is set in the previous step.
  paginationView.render(model.state.search);
};

const controlUpdateServing = function (newServing) {
  // Update state object
  model.updateServing(newServing);

  // Update recipe view
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add or remove bookmark based on 'bookmarked' property (which is set by loadRecipe) and then change it to the opposite state
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe);

  // Update the recipe view based on 'bookmark property'
  recipeView.update(model.state.recipe);

  // Render bookmark
  bookmarkView.render(model.state.bookmarks);
};

const controlRenderBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    // Load recipe to ForkifyAPI server
    await model.loadAddRecipe(newRecipe);

    addRecipeView.renderMessage();

    recipeView.render(model.state.recipe);
    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    // window.history.back();

    setTimeout(function () {
      addRecipeView.toggleModal();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('😥😥😥', err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRenderBookmark(controlRenderBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServing(controlUpdateServing);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerAddRecipe(controlAddRecipe);
};
init();
