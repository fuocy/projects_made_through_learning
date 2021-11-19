import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { API_URL } from './config.js';
import { AJAX } from './helpers';
import { RES_PER_PAGE, KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createFormatRecipe = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    // Get recipe data from API by ID provided
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);

    // Store recipe in STATE obj with nicely formatted form.
    state.recipe = createFormatRecipe(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (query) {
  try {
    // Get all the recipes from API by query provided
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);

    // Store query in state object
    state.search.query = query;

    // Store all the recipes in sate object (already nicely formatted)
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        image: recipe.image_url,
        publisher: recipe.publisher,
        title: recipe.title,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    // Reset current page to 1 for the controller function to render the FIRST 10 recipe object results
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

export const getSearchResultPage = function (page = state.search.page) {
  // Store current page to state object
  state.search.page = page;

  // Calculate the start and end recipes accordingly to the current page
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  // Take the 10 recipes needed out of the array
  return state.search.results.slice(start, end);
};

export const updateServing = function (newServing) {
  // Update new ingredient quantity in STATE obj
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });

  // Update new servings in STATE obj
  state.recipe.servings = newServing;
};

const storeBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  // Add bookmark to the state bookmark array
  state.bookmarks.push(recipe);

  // set bookmark property to true
  // if (recipe.id === state.recipe.id)
  state.recipe.bookmarked = true;

  // Store current bookmark to local storage
  storeBookmark();
};

export const deleteBookmark = function (id) {
  // Find index and delete bookmark needed to be deleted
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  state.recipe.bookmarked = false;

  // Store current bookmark to local storage
  storeBookmark();
};

const getBookmark = function () {
  const savedBookmark = JSON.parse(localStorage.getItem('bookmarks'));
  if (savedBookmark) state.bookmarks = savedBookmark;
};

const init = function () {
  getBookmark();
};

const clearBookmark = function () {
  localStorage.clear('bookmarks');
};

export const loadAddRecipe = async function (recipe) {
  try {
    const ingredients = Object.entries(recipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(entry => {
        const IngredientArr = entry[1].split(',').map(ing => ing.trim());

        if (IngredientArr.length !== 3)
          throw new Error(
            'You need to insert a right format which is ingredients separated by comma 😑'
          );

        const [quantity, unit, description] = IngredientArr;

        return {
          quantity: quantity ? +quantity : null,
          unit,
          description,
        };
      });
    const rec = {
      cooking_time: +recipe.cookingTime,
      image_url: recipe.image,
      publisher: recipe.publisher,
      servings: +recipe.servings,
      source_url: recipe.sourceUrl,
      title: recipe.title,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, rec);
    state.recipe = createFormatRecipe(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

init();
// clearBookmark();
