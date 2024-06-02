import { API_URL } from "./config";
import { getJSON } from "./helpers";

export const state = {
  recipe: {},
};

export const getRecipeData = async function (id) {
  try {
    const url = `${API_URL}/${id}`;
    const data = await getJSON(url);

    const { recipe } = data.data;

    state.recipe = recipe;
  } catch (err) {
    alert(err);
  }
};
