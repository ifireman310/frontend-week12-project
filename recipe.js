// Base URL for the json-server API
const API_URL = "http://localhost:3000/recipes";
const categories = [];

// Buttons and their event listeners
const allRecipesBtn = document.querySelector("#all-recipes-button");
allRecipesBtn.addEventListener("click", getAllRecipes);

const filteredRecipesBtn = document.querySelector("#filtered-recipes-button");
filteredRecipesBtn.addEventListener("click", getFilteredRecipes);

const postRecipeBtn = document.querySelector("#post-recipe-button");
postRecipeBtn.addEventListener("click", postRecipe);

const deleteRecipeBtn = document.querySelector("#delete-recipe-button");
deleteRecipeBtn.addEventListener("click", deleteRecipe);

const hideRecipeBtn = document.querySelector("#hide-recipes-button");
hideRecipeBtn.addEventListener("click", hideAllRecipes);

// References to important DOM elements to be modified
const recipeListBody = $("#recipe-list tbody");
const categorySelect = document.querySelector("#category-select");

async function fetchAllRecipes() {
    const response = await fetch(API_URL);
    const recipes = await response.json();
    return recipes;
}

async function populateAvailableCategories() {
    // This function gets the available categories and populates the dropdown menu with the available options
    // Remove all categories from the option list (except the default "select an option")
    categorySelect.length = 1;

    // Get all available categories
    await getAllCategories();

    // Sort alphabetically then append them to the dropdown menu
    categories.sort();
    for (let i = 0; i < categories.length; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = categories[i];
        categorySelect.appendChild(option);
    }

}

async function getAllCategories() {
    // Empty the current categories array, in case any categories were deleted since last call
    categories.length = 0;

    // Fetch all available recipes
    const recipes = await fetchAllRecipes();
    
    // Add unique categories to the array
    recipes.forEach(recipe => {if (!categories.includes(recipe.category)) {categories.push(recipe.category)}
    })
}

function hideAllRecipes() {
    // Empty the recipe list body to hide all recipes
    recipeListBody.empty();
}

// Main rendering function to render a list of recipes
function renderRecipeList(list) {
    // Empty the recipe list body when rendering an updated list,
    // otherwise clicking the button multiple times will show repeated data
    recipeListBody.empty();

    // Render each individual recipe in the list
    list.forEach(recipe => renderRecipe(recipe));
}

// Rendering function for an individual recipe
function renderRecipe(recipe) {
    // Create the row for the recipe
    const newRow = document.createElement("tr");

    // Create the columns for each portion of data
    const recipeName = document.createElement("td");
    const link = document.createElement("td");
    // creating the anchor so that the link field can be hyperlinked
    const alink = document.createElement("a");
    const author = document.createElement("td");
    const category = document.createElement("td");
    const uniqueId = document.createElement("td");

    // Populate the data
    recipeName.innerHTML = recipe.title;
    alink.href = recipe.link;
    alink.innerHTML = recipe.link;
    link.appendChild(alink);
    author.innerHTML = recipe.author;
    category.innerHTML = recipe.category;
    uniqueId.innerHTML = recipe.id;

    // Append the table data elements to the table row
    newRow.appendChild(recipeName);
    newRow.appendChild(link);
    newRow.appendChild(author);
    newRow.appendChild(category);
    newRow.appendChild(uniqueId);

    // Append the populated row to the body
    recipeListBody.append(newRow);
}

// Function to request all recipes, then render them
async function getAllRecipes() {

    // Make get request to obtain all recipes
    const recipes = await fetchAllRecipes();

    // Call rendering function for the recipes
    renderRecipeList(recipes);
}

// Function to request recipes only from a specific category, then render them
async function getFilteredRecipes() {

    /* This function works by requesting all recipes, then filters 
    the output down to only render what matches the input category */
    
    // Make get request to obtain all recipes
    const selectedCategoryId = categorySelect.value;

    if (selectedCategoryId === '') {
        // No category selected, display all
        getAllRecipes();
    } else {
        const recipes = await fetchAllRecipes();
        const filteredRecipes = [];

        recipes.forEach(recipe => recipe.category === categories[selectedCategoryId] ? filteredRecipes.push(recipe) : null);

        renderRecipeList(filteredRecipes);
    }

}

async function postRecipe () {
    // Function to handle post request to add a new recipe

    const recipeTitle = document.querySelector("#recipe-title").value;
    const recipeLink = document.querySelector("#recipe-link").value;
    const recipeAuthor = document.querySelector("#recipe-author").value;
    const recipeCategory = document.querySelector("#recipe-category").value;

    /*  
        Note that in reality we'd want to use a database auto-increment feature here to generate the id. 
        This method is just relying on probability that two of the same numbers don't get generated
        which should be sufficient for this assignment, but could cause issues in a large scale project.
    */
    const randomId = Math.floor(Math.random() * 10000) + 1;

    const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
            id: randomId.toString(),
            title: recipeTitle,
            link: recipeLink,
            author: recipeAuthor,
            category: recipeCategory
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

    // Repopulate available categories in case a new one was introduced
    populateAvailableCategories();

}

async function deleteRecipe() {
    // Function to handle delete requests for a recipe, requires a recipe id field
    // provided by the user

    const responseDiv = document.querySelector('#response-delete');
    const selectedRecipe = document.querySelector("#recipe-select");
    const selectedId = selectedRecipe.value;

    console.log(selectedId);

    const response = fetch(`${API_URL}/${selectedId}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        responseDiv.textContent = `Recipe #${selectedId} deleted.`;
    })
    .catch(err => {
        responseDiv.textContent = 'Error: ' + err.message;
    })

    // Repopulate available categories in case the last of a category was removed
    populateAvailableCategories();
}

/**** START UP ****/

async function startUp() {
    // Populate the recipe category options upon start-up
    populateAvailableCategories()
}

// Initialization
startUp()