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
        messageTooShort();
        return;
    }

    //get a word entered by a user
    var gamerWord = getGamerWord();

    //check if a word entered by a user exists if it does not exist do not process it
    if(!doesUsersWordExists(gamerWord)){
        messageDoNotExist();
        // alert("This word does not exist!");
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
    reactToUserWonLostTried(gamerWord);
}

//
//function to get the word entered by a user
function getGamerWord(){
    var gamerWord = "";
    for (let i=0; i<5; i++){
        var letterToCheck = letterRows[attemptNumber].getElementsByTagName("input")[i];
        gamerWord += letterToCheck.value;
    }
    return gamerWord;
}

//
//function to check if a word entered by user exist at all
function doesUsersWordExists(userWord){
    var userWord = userWord;
    if(wordsArray.includes(userWord)){
        return true;
    }
    else{
        return false;
    }
}

//function to react when user lost or won the game and to disable letter buttons for
//the time of animation which starts after user clicked the "enter" button
function reactToUserWonLostTried(gamerWord){
    var gamerWord = gamerWord;
    //check if user word equals the planned one then message anout victory and end the game
    //set timeout to allow changing color animation to end before showing a message 
    if(gamerWord == word){
        attemptNumber = 6;
        setTimeout(() => {
            //add confetti animation
            window.confetti({particleCount: 350, angle: -90, spread: 100, gravity: 0.7, origin: {x: 0.3, y: -0.5}});
            window.confetti({particleCount: 350, angle: -90, spread: 100, gravity: 0.7, origin: {x: 0.7, y: -0.5}});
            messageVictoryLose("Congratulations! You won! Try new game!");
        }, 500);
    }
    //check if all attempts were used and the riddle wasn't solved then message about the lose
    //set timeout to allow changing color animation to end before showing a message 
    else if(attemptNumber === 6){
        setTimeout(() => {
            messageVictoryLose(`You lost. The word was ${word.toLowerCase()}. Try again.`);
        }, 500);
    }
    //disable letters in the alphabet/letter buttons until animation stops to work
    //set timeout to allow changing color animation to end before allowimg enter a new word 
    else{
        for (let i = 0; i< letterButtons.length; i++){
            letterButtons[i].setAttribute("disabled", "");
        }
        setTimeout(() => {
            for (let i = 0; i< letterButtons.length; i++){
                letterButtons[i].removeAttribute("disabled");
            }
        }, 500);
    }
}

//
//function to show a message that entered word is too short
function messageTooShort(){
    for (let i = 0; i< letterButtons.length; i++){
        letterButtons[i].setAttribute("disabled", "");
    }
    for (let i = 0; i< actionButtons.length; i++){
        actionButtons[i].setAttribute("disabled", "");
    }
    document.getElementById("tooShortMessage").classList.add("showMessage");
    setTimeout(() => {
        document.getElementById("tooShortMessage").classList.remove("showMessage");
        for (let i = 0; i< letterButtons.length; i++){
            letterButtons[i].removeAttribute("disabled");
        }
        for (let i = 0; i< actionButtons.length; i++){
            actionButtons[i].removeAttribute("disabled");
        }
    }, 1000);
}

//
//function to show a message that entered word doesn't exist
function messageDoNotExist(){
    for (let i = 0; i< letterButtons.length; i++){
        letterButtons[i].setAttribute("disabled", "");
    }
    for (let i = 0; i< actionButtons.length; i++){
        actionButtons[i].setAttribute("disabled", "");
    }
    document.getElementById("doNotExistMessage").classList.add("showMessage");
    setTimeout(() => {
        document.getElementById("doNotExistMessage").classList.remove("showMessage");
        for (let i = 0; i< letterButtons.length; i++){
            letterButtons[i].removeAttribute("disabled");
        }
        for (let i = 0; i< actionButtons.length; i++){
            actionButtons[i].removeAttribute("disabled");
        }
    }, 1000);
}

//
//function to show a message about victory or lose
function messageVictoryLose(message){
    var message = message;
    document.getElementById("victoryLoseMessage").childNodes[0].textContent = message;
    document.getElementById("victoryLoseMessage").classList.add("showMessage");
}

//
//function to go back to the page
function goBack(){
    document.getElementById("victoryLoseMessage").classList.remove("showMessage");
    document.getElementById("giveUpButton").classList.remove("showMessage");
    document.getElementById("newGameButton").classList.add("showMessage");
}

//
//function to reload the page
function reload(){
    window.location.reload();
}

//
//function to give up and show a word
function giveUp(){
    if(attemptNumber < 6){
        messageVictoryLose(`You lost. The word was ${word.toLowerCase()}. Try again.`);
    }
    attemptNumber = 6;
}