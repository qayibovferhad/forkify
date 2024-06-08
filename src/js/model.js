import { API_URL, KEY, RES_PER_PAGE } from "./config";
import { AJAX } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    currentPage: 1,
  },
  bookmarks: [],
};

const modifyRecipeData = function (data) {
  let { recipe } = data.data;
  return {
    id: recipe.id,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    title: recipe.title,
    image: recipe.image_url,
    sourceUrl: recipe.source_url,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const getRecipeData = async function (id) {
  try {
    const url = `${API_URL}${id}?key=${KEY}`;

    const data = await AJAX(url);

    const recipeData = modifyRecipeData(data);
    state.recipe = recipeData;

    let foundBookmark = state.bookmarks.some((book) => book.id === id);
    if (foundBookmark) state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const getSearchResults = async function (query) {
  try {
    const data = await AJAX(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map((rec) => ({
      id: rec.id,
      publisher: rec.publisher,
      title: rec.title,
      image: rec.image_url,
      ...(rec.key && { key: rec.key }),
    }));

    state.search.currentPage = 1;
  } catch (err) {
    console.log(err);
  }
};

export const getSearchResultsPage = function (page = state.search.currentPage) {
  state.search.currentPage = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateRecipeServings = function (newServings) {
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = (ing.quantity * state.recipe.servings) / newServings;
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  localStorage.setItem("bookmarks", JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(state.recipe);

  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex((b) => b.id === id);

  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem("bookmarks");
  if (state) state.bookmarks = JSON.parse(storage);
};

init();

export const uploadRecipe = async function (newRecipe) {
  console.log(Object.entries(newRecipe));

  try {
    const ingredients = Object.entries(newRecipe)
      .filter((ing) => ing[0].startsWith("ingredient") && ing[1] !== "")
      .map((ing) => {
        const ingredient = ing[1].split(",");
        if (ingredient.length !== 3)
          throw new Error("Wrong ingredient format!");
        const [quantity, unit, description] = ingredient;
        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      image_url: newRecipe.image,
      cooking_time: newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      servings: newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    const recipeData = modifyRecipeData(data);
    state.recipe = recipeData;
    addBookmark(state.recipe);
  } catch (e) {
    throw e;
  }
};
