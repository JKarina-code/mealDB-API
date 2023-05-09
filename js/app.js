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

      cardBody.appendChild(recipeHeading);
      cardBody.appendChild(recipeButton);

      recipeCard.appendChild(recipeIMG);
      recipeCard.appendChild(cardBody);

      recipeContent.appendChild(recipeCard);
      result.appendChild(recipeContent);
    });
  }

  function cleanHTML(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  }
}

document.addEventListener("DOMContentLoaded", initApp);
