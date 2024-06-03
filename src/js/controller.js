import * as model from "./model";
import recipeView from "./view/recipeView";
import "core-js/stable";
import "regenerator-runtime";
import searchView from "./view/searchView";
import resultsView from "././view/resultsView";

const controllerRecipe = async () => {
  try {
    const { hash } = window.location;

    const id = hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    await model.getRecipeData(id);

    let { recipe } = model.state;

    recipeView.render(recipe);
  } catch (e) {
    console.log(e);
    recipeView.renderErrorMessage();
  }
};

const controllerSearchResults = async () => {
  try {
    const query = searchView.getSearchQuery();
    resultsView.renderSpinner();

    await model.getSearchResults(query);

    resultsView.render(model.state.search.results);
  } catch (e) {
    console.log(e);
    resultsView.renderErrorMessage();
  }
};

const init = () => {
  searchView.addHandlerSearch(controllerSearchResults);
  recipeView.addHandlerRender(controllerRecipe);
};

init();
