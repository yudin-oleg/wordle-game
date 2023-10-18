var word = ""; //the word to find out
var attemptNumber = 0; //number of the attempt/the row
var letterNumber = 0; //number of the letter in the row
var letterRows = document.getElementsByClassName("row"); //number of the rows in the game
var letterButtons = document.getElementsByClassName("letterButton"); //get list of all letters in the alphabet
var actionButtons = document.getElementsByClassName("action"); //get action buttons
var wordsArray = []; //array of all possible words from where one will be chosen to be found out by user

//
//function for choosing the word and adding eventListeners to alphabet buttons
function startGame(){
    //open the txt file with words
    fetch("words.txt")
    .then((res) => res.text())
    .then((text) => {
    //create an array of words from the file
    //and make words in the array upperCase to correctly compare them with alphabet letters
    wordsArray = text.toUpperCase().split(/\r?\n/);
    var randomNumber = getRandomIntInclusive(0, wordsArray.length); //get a random number to get a word from the array of words
    word = wordsArray[randomNumber]; //make the chosen word upperCase to correctly compare it with alphabet letters
    //add eventListener for every letter in the alphabet/letter button
    for (let i = 0; i< letterButtons.length; i++){
        letterButtons[i].addEventListener('click', enterLetter, false);
    }
    })
    .catch((e) => console.log(e));
}

//
//function for choosing the random number
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
  }

//
//funcion for adding the chosen letter in the row on the display
function enterLetter(e){
    //if all 6 attempts were tried out, do not react
    if (attemptNumber > 5){
        return;
    }
    //check if all 5 letters were entered if so do not react
    else if(letterNumber < 5){
        //put the pressed letter to display
        letterRows[attemptNumber].getElementsByTagName("input")[letterNumber].value = e.target.innerHTML;
        //change the border around the display element to show it was chosen
        letterRows[attemptNumber].getElementsByTagName("input")[letterNumber].classList.add("chosen");
        letterNumber++; //increase the number of the next display element to be processed
    }
}

//
//function to remove letter from the display element
function deleteLetter(){
    //check if a single letter was entered. If not do not react 
    if(letterNumber > 0){
        //clear the display element from the letter
        letterRows[attemptNumber].getElementsByTagName("input")[letterNumber - 1].value = "";
        //remove border for chosen display element
        letterRows[attemptNumber].getElementsByTagName("input")[letterNumber - 1].classList.remove("chosen");
        letterNumber--; //decrease the number of the next display element to be processed
    }
}

//
//function to check the entered word with the planned one
function enterWord(){
    //check if all 6 attempts were used then not allow to press the "enter" button
    if (attemptNumber > 5){
        return;
    }
    //chech if user entered less than 5 letters then show a message about it and don't allow to press the buttons
    else if(letterNumber < 5){
        return;
    }
    //check what status do letters from uers word have
    for(let i=0; i<5; i++){
        var letterToCheck = letterRows[attemptNumber].getElementsByTagName("input")[i];;
        var letterInTheAlphabet = document.getElementById(letterToCheck.value);

        if(letterToCheck.value === word[i]){
            // gamerWord += letterToCheck.value;
            letterToCheck.classList.add("correct");
            letterInTheAlphabet.classList.add("correct");
        }
        else if(word.includes(letterToCheck.value)){
            // gamerWord += letterToCheck.value;
            letterToCheck.classList.add("elsewhere"); //!!!!make letter not to repeat
            letterInTheAlphabet.classList.add("elsewhere");
        }
        else{
            // gamerWord += letterToCheck.value;
            letterToCheck.classList.add("absent");
            letterInTheAlphabet.classList.add("absent");
        }
    }
    letterNumber = 0;
    attemptNumber++;
}
