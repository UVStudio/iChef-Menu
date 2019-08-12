//Notes
//https://stackoverflow.com/questions/10579713/passing-a-local-variable-from-one-function-to-another

//function to capture chosen foods
let totalFoodSelection, totalFoodSelectionArray, totalFoodSelectionArrayValue = [];
function captureFoods(){
  totalFoodSelection, totalFoodSelectionArray, totalFoodSelectionArrayValue = [];
  totalFoodSelection = document.querySelectorAll('.food-input');
  totalFoodSelectionArray = Array.from(totalFoodSelection);
  totalFoodSelectionArray.forEach(function(e){
    totalFoodSelectionArrayValue.push(e.value);
  });
  return totalFoodSelectionArrayValue;
}

const getMeals = document.getElementById('get-Meals');
function getMealsFunction(){
  getMeals.addEventListener('click', function(){
    captureFoods();
    apiCall(totalFoodSelectionArrayValue);
  });
}
getMealsFunction();


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
  arr.every(function(e){
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

//function to show meals
function showMealsPics(arr){
  let mealsPicArr = document.querySelectorAll('.meal-picture');
  for(var i = 0; i < mealsPicArr.length; i++){
    document.getElementById('meal-picture-'+i).src = arr[i].recipe.image;
    document.getElementById('meal-name-'+i).innerText = arr[i].recipe.label;
  }
}

//function to produce more meals beyond the first 4
function moreMeals(arr){
  document.getElementById('more').addEventListener('click', function(){
    let numOfRows = document.querySelectorAll('.meal-suggestions');
    let numOfMeals = document.querySelectorAll('.meal');
    let mealsContainer = document.getElementById('meals-suggestions-container');
    let newSuggestions = document.createElement('div');
    newSuggestions.classList.add('meal-suggestions');
    newSuggestions.id = 'meal-suggestions-'+numOfRows.length;
    mealsContainer.appendChild(newSuggestions);
    let newContent = "<div class='meal' id='meal-"+Number(numOfMeals.length)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length)+"'></h4></div><div class='meal' id='meal-"+Number(numOfMeals.length+1)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length+1)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length+1)+"'></h4></div><div class='meal' id='meal-"+Number(numOfMeals.length+2)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length+2)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length+2)+"'></h4></div><div class='meal' id='meal-"+Number(numOfMeals.length+3)+"'><img src='img/question.png' alt='' class='meal-picture' id='meal-picture-"+Number(numOfMeals.length+3)+"'><h4 class='meal-name' id='meal-name-"+Number(numOfMeals.length+3)+"'></h4></div>";
    document.getElementById('meal-suggestions-'+numOfRows.length).innerHTML = newContent;
    //apiCall(totalFoodSelectionArrayValue);
    showMealsPics(arr);
  });
}











