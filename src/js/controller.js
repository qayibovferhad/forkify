import * as model from "./model";
import recipeView from "./view/recipeView";
import "core-js/stable";
import "regenerator-runtime";

//

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controllerRecipe = async () => {
  try {
    const { hash } = window.location;

    const id = hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    await model.getRecipeData(id);

    let { recipe } = model.state;

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

    recipeView.render(recipe);
  } catch (e) {
    alert(e);
  }
};

const init = () => {
  recipeView.addHandlerRender(controllerRecipe);
};

init();
