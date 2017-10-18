const createStore = (initialState, reducers) => {
    let history = [];
    let state = { ...initialState };

    const wrappedReducers = Object.entries(reducers).reduce((memo, [key, reducer]) => {
        memo[key] = function(...args) {
            return this.setState(
                reducer(state, ...args)
            );
        };
        return memo;
    },
    {});

    return {
        ...wrappedReducers,

        getHistory: () => {
            return [...history]
        },

        getState: () => {
            return { ...state }
        },

        setState: (newState) => {
            history.unshift(state);
            historyIndex = history.length - 1;
            state = {
                ...newState
            };
        },

        resetState: () => {
            history = [];
            state = {
               ...initialState
            }
        }
    };
};

// Main program function
const program = (deck) => {
    const store = createStore({
        firstCard: null,
        secondCard: null,
        playingCards: null,
        cardsInGame: null,
        numberOfGuesses: 0,
        numberOfMatches: 0
    }, {
        setFirstCard: (currentState, firstCard) => ({
            ...currentState,
            firstCard
        }),

        setSecondCard: (currentState, secondCard) => ({
            ...currentState,
            secondCard
        }),

        incrementGuesses: (currentState) => ({
            ...currentState,
            numberOfGuesses: currentState.numberOfGuesses+1
        }),

        incrementMatches: (currentState) => ({
            ...currentState,
            numberOfMatches: currentState.numberOfMatches+1
        }),

        setPlayingCards: (currentState, playingCards) => ({
            ...currentState,
            playingCards
        }),
        
        setCardsInGame: (currentState, cardsInGame) => ({
            ...currentState,
            cardsInGame
        })
    });

    // Function to handle when a card is clicked
    const handleCardClick = (e) => {
        // For all cards
        e.target.style.backgroundImage = `url("${e.target.dataset.image}")`;                                // Turn card over

        if(!store.getState().firstCard){                                                                    // First Click
            store.setFirstCard(e.target);                                                                   // Set First Card
        }
        else if (store.getState().firstCard && !store.getState().secondCard && (store.getState().firstCard !== e.target)){ // Second Click & not same card clicked

            store.setSecondCard(e.target);                                                                  // Set Second Card
            updateNumberOfGuesses();                                                                        // Update Guesses in State and UI

            store.getState().playingCards.forEach((playingCard, index) => {
                playingCard.style.pointerEvents = 'none';                                                   // Prevent clicking 3+ cards
            });

            if(store.getState().firstCard.dataset.card !== store.getState().secondCard.dataset.card){       // If the two cards chosen don't match
                setTimeout(() => {
                    store.getState().firstCard.style.backgroundImage = `url("images/RedBack.png")`;         // Hide card after 1 sec
                    store.getState().secondCard.style.backgroundImage = `url("images/RedBack.png")`;        // Hide card after 1 sec

                    store.getState().playingCards.forEach((playingCard, index) => {
                        playingCard.style.pointerEvents = 'auto';                                           // Re-enable clicking after 1 sec
                    });
                    store.setFirstCard(null);
                    store.setSecondCard(null);
                }, 1000);                                                                                   // Run code after 1 sec
            }
            else{                                                                                           // If the two cards chosen do match
                store.incrementMatches();                                                                   // Update total of matches 
                store.getState().playingCards.forEach((playingCard, index) => {
                    playingCard.style.pointerEvents = 'auto';                                               // Re-enable clicking instantly
                });
                store.setFirstCard(null);
                store.setSecondCard(null);
                checkForWin();
            }
        }
        else if(store.getState().firstCard && !store.getState().secondCard && (store.getState().firstCard === e.target)){ // Same card clicked twice
            store.getState().firstCard.style.backgroundImage = `url("images/RedBack.png")`;                 // Hide card (Deselect first card)
            store.setFirstCard(null);

            store.getState().playingCards.forEach((playingCard, index) => {
                playingCard.style.pointerEvents = 'auto';                                                   // Re-enable clicking
            });
        }
        console.log(store.getState());                                                                      // Current State
        console.log(store.getHistory());                                                                    // History
    };

    // Function to check for a win
    const checkForWin = () => {
        if(store.getState().numberOfMatches === 8){
            alert('Congrats you won!');                                                                     // Alert is blocking
            startPlaying();                                                                                 // Set up new game when alert is dismissed
        }
    };

    // Function to create a Card object
    const createCard = (number, suit, image) => {
        return {
            number,
            suit,
            image
        };
    };

    // Update Guesses UI and State
    const updateNumberOfGuesses = () => {
        store.incrementGuesses();                                                                           // Update number of guesses
        console.log(store.getState().numberOfGuesses);
        const guessesUI = document.querySelector('#guesses');
        guessesUI.textContent = `Number of guesses: ${store.getState().numberOfGuesses}`;
    };

    // Generate Cards
    const generateCards = (noOfCards) => {
        const suits = ['Diamonds', 'Hearts', 'Spades', 'Clubs'];                                            // Available suits
        const chosenNumbers = [];
        while(chosenNumbers.length < noOfCards/2){                                                          // Choose numbers
            let rand = Math.ceil(Math.random()*13);                                                         // Number must be between 1 and 13
            if(chosenNumbers.indexOf(rand) > -1) continue;
            chosenNumbers[chosenNumbers.length] = rand;                                                     // Insert number into chosenNumbers array
        }

        let selectedCards = chosenNumbers.map(number => {                                                   // Populate array of cards
            const rand = Math.ceil(Math.random()*3);
            const suit = suits[rand];                                                                       // Choose a suit from random
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
        });
        store.setCardsInGame([...selectedCards, ...selectedCards]);
    };

    const displayCards = (deck) => {
        
        store.setPlayingCards(store.getState().cardsInGame.map((playingCard) => {
                const card = document.createElement('div');
                card.classList.add('card');
                card.dataset.card = `${playingCard.number}${playingCard.suit}`;
                card.dataset.image = playingCard.image;
                return card;
            })
        );

        store.getState().playingCards.forEach(card => {
            deck.appendChild(card);
        })
    };

    const removeCards = (deck) => {
        while (deck.firstChild) {
            deck.removeChild(deck.firstChild);
        }
    }

    // Function to shuffle cards
    const shuffleCards = (cards) => {
        const shuffleArray = arr => arr.sort(() => Math.random() - 0.5);
        const shuffledDeck = shuffleArray(cards);
        store.setCardsInGame(shuffledDeck);
    }

    // Function to reset game play and start new game
    const startPlaying = () => {
        store.resetState();                                                                             // Reset State
        removeCards(deck);                                                                              // Remove any cards from deck
        generateCards(16);                                                                              // Generate Cards
        shuffleCards(store.getState().cardsInGame);                                                     // Shuffle Cards
        displayCards(deck);                                                                             // Update Cards in UI
        store.getState().playingCards.forEach(playingCard => playingCard.addEventListener('click', handleCardClick)); // Add event listener to cards    
    }

    startPlaying();
    const newGameButton = document.querySelector('#new-game-button');
    newGameButton.addEventListener('click', startPlaying);
}

// Run Program
program(
    document.querySelector('#deck')
);