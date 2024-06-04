import { API_URL, RES_PER_PAGE } from "./config";
import { getJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
    resultsPerPage: RES_PER_PAGE,
    currentPage: 1,
  },
};

export const getRecipeData = async function (id) {
  try {
    const url = `${API_URL}${id}`;
    const data = await getJSON(url);

    let { recipe } = data.data;
    recipe = {
      id: recipe.id,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      title: recipe.title,
      image: recipe.image_url,
      sourceUrl: recipe.source_url,
      cookingTime: recipe.cooking_time,
    };
    state.recipe = recipe;
  } catch (err) {
    throw err;
  }
};

export const getSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map((rec) => ({
      id: rec.id,
      publisher: rec.publisher,
      title: rec.title,
      image: rec.image_url,
    }));
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
