import * as model from "./model";
import recipeView from "./view/recipeView";
import "core-js/stable";
import "regenerator-runtime";
import searchView from "./view/searchView";
import resultsView from "././view/resultsView";
import paginationView from "./view/paginationView";

const controllerRecipe = async () => {
  try {
    const { hash } = window.location;

    const id = hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

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

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (e) {
    console.log(e);
    resultsView.renderErrorMessage();
  }
};

const controllerSearchPagination = async (goToPage) => {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const controllerUpdateServings = (updateTo) => {
  model.updateRecipeServings(updateTo);

  recipeView.update(model.state.recipe);
};

const init = () => {
  searchView.addHandlerSearch(controllerSearchResults);
  recipeView.addHandlerRender(controllerRecipe);
  recipeView.updateServings(controllerUpdateServings);
  paginationView.addHandlerClick(controllerSearchPagination);
};

init();
