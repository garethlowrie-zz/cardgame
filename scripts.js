let chosenNumbers = [];
let cards = [];                                                 // To hold cards to use in the game
const suits = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];         // Available suits
const playingCards = [...document.querySelectorAll('.card')];   // Get Playing Cards from DOM AND Convert NodeList to Array
const newGameButton = document.querySelector('#new-game-button'); // Get New Game Button
console.log(newGameButton);
const userClicks = 0;                                           // Keep track of user clicks

/**
 * Populate an array with random numbers
 * 
 * @param {array} An array to store the generated random numbers 
 * @param {integer} The total amount of random numbers to generate 
 */
function generateRandomNumbers(){
    chosenNumbers = [];
    while(chosenNumbers.length < 8){
        let rand = Math.ceil(Math.random()*13)
        if(chosenNumbers.indexOf(rand) > -1) continue;
        chosenNumbers[chosenNumbers.length] = rand;
    }
}

/**
 * A function to choose a random suit
 * 
 * @returns string Suit
 */
function generateRandomSuit(){
    let rand = Math.ceil(Math.random()*3);
    return suits[rand];
}

/**
 * A funtion to choose the 8 pairs of cards to use in the game
 * 
 */
function chooseCards(){
    chosenNumbers = [];         // Reset Numbers
    generateRandomNumbers();    // Generate Random Numbers
    let selectedCards = chosenNumbers.map(number => { // Populate array of cards
        const suit = generateRandomSuit(); // Choose a suit from random
        switch(number){
            case 1:
            return createCard(`Ace`, `${suit}`, `images/Ace${suit}.png`);
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            return createCard(`${number}`, `${suit}`, `images/${number}${suit}.png`);
            case 11:
            return createCard(`Jack`, `${suit}`, `images/Jack${suit}.png`);
            case 12:
            return createCard(`Queen`, `${suit}`, `images/Queen${suit}.png`);
            case 13:
            return createCard(`King`, `${suit}`, `images/King${suit}.png`);
        }
    })
    let selectedCards2 = [...selectedCards]; // Create a copy of each card chosen above
    cards = [...selectedCards, ...selectedCards2]; // Add pairs of cards to main card deck
}

/**
 * A function to create a Card object
 * 
 * @param {integer} Card Number 
 * @param {string} Card Suit
 * @param {string} Card Image
 * @returns 
 */
function createCard(number, suit, image){
    return {
        number,
        suit,
        image
    };
}

/**
 * A function to add card data to the UI
 * 
 */
function displayCards(){
    playingCards.forEach((playingCard, index) => {
        playingCard.dataset.number = cards[index].number;
        playingCard.dataset.suit = cards[index].suit;
        playingCard.dataset.image = cards[index].image;
    });
}

function startPlaying(){
    chooseCards();  // Choose 8 random cards
    const shuffleArray = arr => arr.sort(() => Math.random() - 0.5); // Shuffle Function
    shuffleArray(cards); // Shuffle Cards
    displayCards(); // Add cards to UI
}

// function handleCardClick(){

// }

// function handleNewGameClick(e){
//     e.preventDefault();
//     startPlaying();
// }

// playingCards.forEach(card => card.addEventListener('click', handleCardClick));
//newGameButton.addEventListener('click', handleNewGameClick);
window.onload = startPlaying;