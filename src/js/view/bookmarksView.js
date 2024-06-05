import View from "./View";
import icons from "url:../../img/icons.svg";
import previewView from "./previewView";
class BookmarksReview extends View {
  _parentElement = document.querySelector(".bookmarks__list");
  _error = "No bookmarks found for your query! Please try again!";
  _message = "";

  addHandlerRender(handler) {
    window.addEventListener("load", handler);
  }
  _generateMarkup() {
    return this._data
      .map((result) => previewView.render(result, false))
      .join("");
  }
}

export default new BookmarksReview();
