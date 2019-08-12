//Notes
//https://stackoverflow.com/questions/10579713/passing-a-local-variable-from-one-function-to-another

//function to capture chosen foods
let totalFoodSelection, totalFoodSelectionArray, totalFoodSelectionArrayValue = [];
function captureFoods(){
  totalFoodSelection, totalFoodSelectionArray, totalFoodSelectionArrayValue = [];
  totalFoodSelection = document.querySelectorAll('.food-input');
  totalFoodSelectionArray = Array.from(totalFoodSelection);
  totalFoodSelectionArray.forEach(e => {
    totalFoodSelectionArrayValue.push(e.value);
  });
  return totalFoodSelectionArrayValue;
}

//function to get meals
const getMeals = document.getElementById('get-Meals');
function getMealsFunction(){
  getMeals.addEventListener('click', () => {
    captureFoods();
    apiCall(totalFoodSelectionArrayValue);
    deactivateInputs();
    getMeals.classList.add('none');
    getMeals.classList.remove('block');
    document.getElementById('reset').classList.add('block');
  });
}
getMealsFunction();

//function to grey out the input fields
function deactivateInputs(){
  totalFoodSelectionArray.forEach(e => {
    e.disabled = true;
    e.classList.add('food-grey');
  });
}

//function of the reset button
const resetBtn = document.getElementById('reset');
function reset(){
  resetBtn.addEventListener('click', () => {
    totalFoodSelectionArray.forEach(e => {
      e.disabled = false;
      e.classList.remove('food-grey');
      e.value = '';
    });
    //consts need to be declared inside as we need to capture the divs at time of click
    const allMealsPics = document.querySelectorAll('.meal-picture');
    const allMealsPicsArray = Array.from(allMealsPics);
    const mealsNames = document.querySelectorAll('.meal-name');
    const mealsNamesArray = Array.from(mealsNames);
    allMealsPicsArray.forEach(e => {
      e.src = 'img/question.png';
    });
    mealsNamesArray.forEach(e => {
      e.innerText = '';
    });
    removeDivs();
    getMeals.classList.add('block');
    getMeals.classList.remove('none');
    resetBtn.classList.add('none');
    resetBtn.classList.remove('block');
  });
}
reset();

//function to remove div at reset
function removeDivs(){
  const mealSuggestions = document.querySelectorAll('.meal-suggestions');
  const mealSuggestionsArray = Array.from(mealSuggestions);
  for(i = 1; i < mealSuggestionsArray.length; i++){
    mealSuggestionsArray[i].remove();
  }
}

//function to make the HTTP call using the chosen foods, then call functions to show meals
function apiCall(arr){
  let foodsInApiCall = [];
  let foodsLength = arr.length;
  for(i = 0; i < foodsLength; i++){
    foodsInApiCall.push(arr[i]+'%20');
  }
  let apiCallString = foodsInApiCall.join('').replace(' ', '%20');
  let apiCallStringURL = apiCallString.slice(0, apiCallString.length-3);

  let xhr = new XMLHttpRequest();
  let url = "https://api.edamam.com/search?q="+apiCallStringURL+"&app_id=31b8f875&app_key=e71ad44511714e76cb2612a91a2dd6e6&from=0&to=50";

  xhr.onload = function (){
    if (this.status == 200) {
      let jsonReturn = JSON.parse(this.responseText);
      jsonList = jsonReturn.hits;
      callBack(arr); 
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

//function to only include jsonList items where ingredients contain the chosen foods (the array items in totalFoodSelectionArrayValue)
let filterList = function (list, arr){
  let filteredMealsArray = [];
  arr.every(e => {
    let searchRegex = new RegExp(e, 'i');   
    for(i = 0; i < list.length; i++){
      if(searchRegex.test(list[i].recipe.ingredientLines.join())){
        filteredMealsArray.push(list[i]);
      }
    }
  });
  return filteredMealsArray;
}

function callBack(arr) {
  //essentially, arr is totalFoodSelectionArrayValue returned in function captureFoods
  //jsonList is from the API call
  filterList(jsonList, arr);
  showMealsPics(filterList(jsonList, arr));
  moreMeals(filterList(jsonList, arr));
}

//function to show meals pictures
function showMealsPics(arr){
  const mealsPicArr = document.querySelectorAll('.meal-picture');
  for(var i = 0; i < mealsPicArr.length; i++){
    document.getElementById('meal-picture-'+i).src = arr[i].recipe.image;
    document.getElementById('meal-name-'+i).innerText = arr[i].recipe.label;
  }
}

//function to produce more meals beyond the first 4

function moreMeals(arr){
  document.getElementById('more').addEventListener('click', function(){
    const numOfRows = document.querySelectorAll('.meal-suggestions');
    const numOfMeals = document.querySelectorAll('.meal');
    const mealsContainer = document.getElementById('meals-suggestions-container');
    const newSuggestions = document.createElement('div');
    newSuggestions.classList.add('meal-suggestions');
    newSuggestions.id = 'meal-suggestions-'+numOfRows.length;
    mealsContainer.appendChild(newSuggestions);
    let newContent = "<div class='meal' id='meal-"+Number(numOfMeals.length)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length)+"'></h4></div><div class='meal' id='meal-"+Number(numOfMeals.length+1)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length+1)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length+1)+"'></h4></div><div class='meal' id='meal-"+Number(numOfMeals.length+2)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length+2)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length+2)+"'></h4></div><div class='meal' id='meal-"+Number(numOfMeals.length+3)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length+3)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length+3)+"'></h4></div>";
    document.getElementById('meal-suggestions-'+numOfRows.length).innerHTML = newContent;
    showMealsPics(arr);
  });
}







