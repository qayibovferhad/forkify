import { API_URL } from "./config";
import { getJSON } from "./helpers";

export const state = {
  recipe: {},
  search: {
    query: "",
    results: [],
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
