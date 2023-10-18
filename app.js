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
    //add eventListener for every letter in the alphabet/letter button
    for (let i = 0; i< letterButtons.length; i++){
        letterButtons[i].addEventListener('click', enterLetter, false);
    }
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