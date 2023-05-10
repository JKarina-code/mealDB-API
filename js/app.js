function initApp() {
  const selectCategories = document.querySelector("#categories");
  selectCategories.addEventListener("change", chooseCategory);

  getStart();

  function getStart() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(url)
      .then((response) => response.json())
      .then((data) => showImagesStart(data.categories));
  }
  function showImagesStart(images = []) {
    images.forEach((image) => {
      const { strCategory, strCategoryThumb } = image;

      const divStart = document.createElement("DIV");
      divStart.classList.add("col-md-4");

      const cardBody = document.createElement("DIV");
      cardBody.classList.add("card-body");
      const card = document.createElement("DIV");
      card.classList.add("card", "mb-4");
      const heading = document.createElement("H2");
      heading.classList.add("card-title", "mb-3");
      heading.textContent = strCategory;

      const startImage = document.createElement("IMG");
      startImage.classList.add("card-img-top");
      startImage.alt = `Image of recipe ${strCategory}`;
      startImage.src = `${strCategoryThumb}`;

      cardBody.appendChild(heading);
      card.appendChild(startImage);
      card.appendChild(cardBody);
      divStart.appendChild(card);
      result.appendChild(divStart);
    });
  }

  getCategories();
  function getCategories() {
    const url = "https://www.themealdb.com/api/json/v1/1/categories.php";
    fetch(url)
      .then((response) => response.json())
      .then((data) => showCategories(data.categories));
  }
  function showCategories(categories = []) {
    categories.forEach((category) => {
      const { strCategory } = category;
      const option = document.createElement("OPTION");
      option.value = strCategory;
      option.textContent = strCategory;
      selectCategories.appendChild(option);
    });
  }

  function chooseCategory(e) {
    const category = e.target.value;
    url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => showRecipes(data.meals));
  }

  function showRecipes(recipes = []) {
    cleanHTML(result);

    const heading = document.createElement("H2");
    heading.classList.add("text-center", "text-black", "my-5");
    heading.textContent = recipes.length ? "Results" : "No Results";
    result.appendChild(heading);

    recipes.forEach((recipe) => {
      const { strMeal, strMealThumb, idMeal } = recipe;
      const result = document.querySelector("#result");
      const recipeContent = document.createElement("DIV");
      recipeContent.classList.add("col-md-4");

      const recipeCard = document.createElement("DIV");
      recipeCard.classList.add("card", "mb-4");

      const recipeIMG = document.createElement("IMG");
      recipeIMG.classList.add("card-img-top");
      recipeIMG.alt = `Image of recipe ${strMeal}`;
      recipeIMG.src = `${strMealThumb}`;

      const cardBody = document.createElement("DIV");
      cardBody.classList.add("card-body");

      const recipeHeading = document.createElement("H2");
      recipeHeading.classList.add("card-title", "mb-3");
      recipeHeading.textContent = strMeal;

      const recipeButton = document.createElement("BUTTON");
      recipeButton.classList.add("btn", "btn-danger", "w-100");
      recipeButton.textContent = "Show Recipe";
      recipeButton.onclick = function () {
        chooseRecipe(idMeal);
      };
      cardBody.appendChild(recipeHeading);
      cardBody.appendChild(recipeButton);

      recipeCard.appendChild(recipeIMG);
      recipeCard.appendChild(cardBody);

      recipeContent.appendChild(recipeCard);
      result.appendChild(recipeContent);
    });
  }

  function chooseRecipe(idMeal) {
    const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => showRecipesModal(data.meals[0]));
  }

  function showRecipesModal(recipe) {
    const modal = new bootstrap.Modal(document.querySelector("#modal"));
    const { idMeal, strInstructions, strMeal, strMealThumb } = recipe;

    const modalTitle = document.querySelector(".modal .modal-title");
    const modalBody = document.querySelector(".modal .modal-body");
    modalTitle.textContent = strMeal;
    modalBody.innerHTML = `
    <img class="img-fluid" src="${strMealThumb}" alt="recipe ${strMeal}" />
    <h3 class="my-3">Instructions</h3>
    <p>${strInstructions}</p>
    <h3 class="my-3">Ingredients and amounts</h3>
`;

    //Show ingredients

    const listGroup = document.createElement("UL");
    listGroup.classList.add("list-group");
    for (let i = 1; i <= 20; i++) {
      if (recipe[`strIngredient${i}`]) {
        const ingredient = recipe[`strIngredient${i}`];
        const amount = recipe[`strMeasure${i}`];
        const ingredientLi = document.createElement("LI");
        ingredientLi.classList.add("list-group-item");
        ingredientLi.textContent = `${ingredient}  - ${amount}`;

        listGroup.appendChild(ingredientLi);
      }
    }
    modalBody.appendChild(listGroup);
    const modalFooter = document.querySelector(".modal-footer");
    cleanHTML(modalFooter);
    const btnFavorite = document.createElement("BUTTON");
    btnFavorite.classList.add("btn", "btn-danger", "col");
    btnFavorite.textContent = existLocalStorage(idMeal)
      ? "Delete Favorite"
      : "Save Favorite";

    //LocalStorage
    btnFavorite.onclick = function () {
      if (existLocalStorage(idMeal)) {
        deleteFavorite(idMeal);
        btnFavorite.textContent = "Save Favorite";
        showToast("Successfully Deleted");
        modal.hide();
        return;
      }
      addFavorite({
        id: idMeal,
        title: strMeal,
        image: strMealThumb,
      });

      btnFavorite.textContent = "Delete Favorite";
      showToast("Successfully Added");
      modal.hide();
    };

    const btnClose = document.createElement("BUTTON");
    btnClose.classList.add("btn", "btn-secondary", "col");
    btnClose.textContent = "Close";
    btnClose.onclick = function () {
      modal.hide();
    };

    modalFooter.appendChild(btnFavorite);
    modalFooter.appendChild(btnClose);
    modal.show();
  }
  function addFavorite(recipe) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];
    localStorage.setItem("favorites", JSON.stringify([...favorites, recipe]));
  }

  function deleteFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];
    const newFavorites = favorites.filter((favorite) => favorite.id !== id);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  }

  function existLocalStorage(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) ?? [];
    return favorites.some((favorite) => favorite.id === id);
  }

  function showToast(message) {
    const toastDiv = document.querySelector("#toast");
    const toastBody = document.querySelector(".toast-body");
    toastBody.textContent = message;
    const toast = new bootstrap.Toast(toastDiv);
    toast.show();
  }

  function cleanHTML(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", initApp);
