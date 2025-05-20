const API_URL = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const homeButton = document.getElementById('homeButton');
const recipeContainer = document.getElementById('recipeContainer');
const loader = document.getElementById('loader');
async function fetchRecipes(query = '') {
  try {
    loader.classList.remove('hidden');
    const response = await fetch(`${API_URL}${query}`);
    const data = await response.json();
    const allRecipes = data.meals;

    if (!allRecipes) {
      displayRecipes(null);
      return;
    }
    const filteredRecipes = allRecipes.filter(recipe => 
      recipe.strArea.toLowerCase().includes('south') || 
      recipe.strMeal.toLowerCase().includes(query.toLowerCase())
    );

    displayRecipes(filteredRecipes.length > 0 ? filteredRecipes : allRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    recipeContainer.innerHTML = '<h2>Error fetching recipes. Please try again later.</h2>';
  } finally {
    loader.classList.add('hidden');
  }
}function displayRecipes(recipes) {
  recipeContainer.innerHTML = '';

  if (!recipes || recipes.length === 0) {
    recipeContainer.innerHTML = '<h2>No recipes found 😢</h2>';
    return;
  }

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');

    recipeCard.innerHTML = `
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
      <div class="content">
        <h3>${recipe.strMeal}</h3>
        <p><strong>Category:</strong> ${recipe.strCategory}</p>
        <p><strong>Area:</strong> ${recipe.strArea}</p>
      </div>
    `;

    recipeCard.addEventListener('click', () => showRecipeDetails(recipe));
    recipeContainer.appendChild(recipeCard);
  });
}
function showRecipeDetails(recipe) {
  const recipeDetails = document.createElement('div');
  recipeDetails.classList.add('popup');

  recipeDetails.innerHTML = `
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      <h2>${recipe.strMeal}</h2>
      <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
      <p><strong>Category:</strong> ${recipe.strCategory}</p>
      <p><strong>Area:</strong> ${recipe.strArea}</p>
      <h3>Instructions</h3>
      <p>${recipe.strInstructions}</p>
      ${recipe.strYoutube ? `
        <h3>Watch Video</h3>
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/${extractYouTubeID(recipe.strYoutube)}" frameborder="0" allowfullscreen></iframe>
      ` : ''}
    </div>
  `;

  document.body.appendChild(recipeDetails);
  recipeDetails.querySelector('.close-btn').addEventListener('click', () => {
    recipeDetails.remove();
  });
}
function extractYouTubeID(url) {
  const urlObj = new URL(url);
  return urlObj.searchParams.get('v');
}
function showAlertPopup(message) {
  const alertPopup = document.createElement('div');
  alertPopup.classList.add('popup');

  alertPopup.innerHTML = `
    <div class="popup-content">
      <span class="close-btn">&times;</span>
      <h2>Notice</h2>
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(alertPopup);
  alertPopup.querySelector('.close-btn').addEventListener('click', () => {
    alertPopup.remove();
  });
}
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();

  if (query === '') {
    showAlertPopup("Please enter a recipe name or ingredient!");
    return;
  }

  fetchRecipes(query);
});
homeButton.addEventListener('click', () => {
  window.location.href = 'index.html';
});
fetchRecipes();
