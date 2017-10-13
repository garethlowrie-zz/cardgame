let chosenNumbers = [];
let cards = [];                                                                 // To hold cards to use in the game
const suits = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];                        // Available suits
const playingCards = [...document.querySelectorAll('.card')];                   // Get Playing Cards from DOM AND Convert NodeList to Array
const newGameButton = document.querySelector('#new-game-button');               // Get New Game Button
let userClicks = 0;                                                             // Keep track of user clicks
let matches = 0;
let guesses = 0;

/**
 * Populate an array with random numbers
 * 
 * @param {array} An array to store the generated random numbers 
 * @param {integer} The total amount of random numbers to generate 
 */
function generateRandomNumbers(){
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
    generateRandomNumbers();                                                    // Generate Random Numbers
    let selectedCards = chosenNumbers.map(number => {                           // Populate array of cards
        const suit = generateRandomSuit();                                      // Choose a suit from random
        switch(number){
            case 1:
            return createCard(`Ace`, suit, `images/Ace${suit}.png`);
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            return createCard(number, suit, `images/${number}${suit}.png`);
            case 11:
            return createCard(`Jack`, suit, `images/Jack${suit}.png`);
            case 12:
            return createCard(`Queen`, suit, `images/Queen${suit}.png`);
            case 13:
            return createCard(`King`, suit, `images/King${suit}.png`);
            default:
            console.error(`Error`, `The value (${number}) in chosenNumbers did not get handled by the switch`);
        }
    })
    let selectedCards2 = [...selectedCards];                                    // Create a copy of each card chosen above
    cards = [...selectedCards, ...selectedCards2];                              // Add pairs of cards to main card deck
}

/**
 * A function to create a Card object
 * 
 * @param {integer} Card Number 
 * @param {string} Card Suit
 * @param {string} Card Image
 * @returns Obj
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
        playingCard.dataset.card = `${cards[index].number}${cards[index].suit}`;
        playingCard.dataset.image = cards[index].image;
    });
}

/**
 * A function to reset the game back to starting point
 */
function reset(){
    chosenNumbers = [];
    cards = [];
    userClicks = 0; 
    matches = 0;
    guesses = 0;
    updateTotalGuesses();
    playingCards.forEach((playingCard, index) => {
        playingCard.style.backgroundImage = `url("images/RedBack.png")`;
    });
}

/**
 * A function to get the game ready for the user to play
 */
function startPlaying(){
    reset();
    chooseCards();                                                              // Choose 8 random cards
    const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);            // Shuffle Function
    shuffleArray(cards);                                                        // Shuffle Cards
    displayCards();                                                             // Add cards to UI
}

/**
 * A function to handle when a card is click in game play.
 * @param {event} e Event 
 */
function handleCardClick(e){
    userClicks++;                                                               // Record user click
    e.target.style.backgroundImage = `url("${e.target.dataset.image}")`;        // Turn card over
    e.target.classList.add('currentGuess');                                     // Apply currentGuess class to card
    
    if(userClicks === 2){                                                       // If second click
        e.target.classList.add('currentGuess');                                 // Apply currentGuess class to card
        const [card1, card2] = document.querySelectorAll('.currentGuess');      // Select currentGuess cards
        
        if(card2 !== undefined){                                                // If both cards clicked are different (i.e 2 cards found)
            playingCards.forEach((playingCard, index) => {
                playingCard.style.pointerEvents = 'none';                       // Prevent clicking 3+ cards
            });

            if(card1.dataset.card != card2.dataset.card){                       // If the two cards chosen don't match
                setTimeout(() => {
                    card1.style.backgroundImage = `url("images/RedBack.png")`;  // Hide card after 1 sec
                    card2.style.backgroundImage = `url("images/RedBack.png")`;  // Hide card after 1 sec

                    playingCards.forEach((playingCard, index) => {
                        playingCard.style.pointerEvents = 'auto';               // Re-enable clicking after 1 sec
                    });
                }, 1000);                                                       // Run code after 1 sec
            }
            else{                                                               // If the two cards chosen do match
                matches++;                                                      // Update total of matches 
                playingCards.forEach((playingCard, index) => {
                    playingCard.style.pointerEvents = 'auto';                   // Re-enable clicking instantly
                });
            }

            card1.classList.remove('currentGuess');                             // Remove currentGuess class
            card2.classList.remove('currentGuess');                             // Remove currentGuess class
            userClicks = 0;                                                     // Reset user clicks
            guesses++;                                                          // Update total guesses
            updateTotalGuesses();                                               // Show user how many guesses made
            checkForWin();                                                      // Check if game won
        }
        else {                                                                  // Same card was clicked
            userClicks--;
        }
    }
}

/**
 * A function to update the total number of guesses in the UI
 */
function updateTotalGuesses(){
    const guessesText = document.querySelector('#guesses');
    guessesText.textContent = `Number of guesses: ${guesses}`
}

/**
 * A function to check if game has been won
 */
function checkForWin(){
    if(matches === 8){
        alert('Congrats you won!');                                             // Alert is blocking
        startPlaying();                                                         // Set up new game when alert is dismissed
    }
}

/**
 * A function to handle the New Game button
 * @param {event} e Event 
 */
function handleNewGameClick(e){
    e.preventDefault();
    startPlaying();
}

playingCards.forEach(card => card.addEventListener('click', handleCardClick));  // Add click handler to all cards
newGameButton.addEventListener('click', handleNewGameClick);                    // Add click handler to New Game button
window.onload = startPlaying;                                                   // When window loads start the game