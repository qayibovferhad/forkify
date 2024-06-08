import * as model from "./model";
import recipeView from "./view/recipeView";
import "core-js/stable";
import "regenerator-runtime";
import searchView from "./view/searchView";
import resultsView from "././view/resultsView";
import paginationView from "./view/paginationView";
import bookmarksView from "./view/bookmarksView";
import previewView from "./view/previewView";
import addRecipeView from "./view/addRecipeView";
import { CLOSE_MODAL_SEC } from "./config";

const controllerRecipe = async () => {
  try {
    const { hash } = window.location;

    const id = hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

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

const controllerAddBookmark = function () {
  if (model.state.recipe.bookmarked)
    model.deleteBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controllerBookmark = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controllerUpload = async function (data) {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(data);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, "", `#${model.state.recipe.id}`);
    setTimeout(() => {
      addRecipeView._toggleModal();
    }, CLOSE_MODAL_SEC * 1000);
  } catch (e) {
    addRecipeView.renderErrorMessage(e);
  }
};

const init = () => {
  addRecipeView._addHandlerUpload(controllerUpload);
  bookmarksView.addHandlerRender(controllerBookmark);
  searchView.addHandlerSearch(controllerSearchResults);
  recipeView.addHandlerRender(controllerRecipe);
  recipeView.updateServings(controllerUpdateServings);
  recipeView.addHandlerBookmark(controllerAddBookmark);
  paginationView.addHandlerClick(controllerSearchPagination);
};

init();
