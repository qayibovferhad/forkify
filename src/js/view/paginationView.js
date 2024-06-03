import View from "./View";
import icons from "url:../../img/icons.svg";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  _generateMarkup() {
    const currentPage = this._data.currentPage;
    const pages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const nextButton = this._generateNextButton();

    const prevButton = this._generatePrevButton();

    if (currentPage === 1 && currentPage < pages) {
      return nextButton(currentPage + 1);
    }

    if (currentPage === pages && pages > 1) {
      return prevButton(currentPage - 1);
    }

    if (currentPage < pages && currentPage > 1) {
      return `${prevButton(currentPage - 1)} ${nextButton(currentPage + 1)} `;
    }

    return "";
  }

  _generateNextButton() {
    return (goToPage) => {
      return `<button data-goToPage="${goToPage}" class="btn--inline pagination__btn--next">
      <span>Page ${goToPage}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>;
    `;
    };
  }
  _generatePrevButton() {
    return (goToPage) => {
      return `
     <button data-goToPage="${goToPage}"  class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${goToPage}</span>
          </button>
    `;
    };
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const btn = e.target.closest(".btn--inline");

      if (!btn) return;

      const goToPage = +btn.dataset.gotopage;

      handler(goToPage);
    });
  }
}

export default new PaginationView();
