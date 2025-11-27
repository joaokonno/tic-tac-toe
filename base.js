// Factory function: creates a player with a name and a board symbol (like 'x' or 'o')
function createPlayer(name, symbol){
    return {name, symbol};
}

// Module (IIFE) that encapsulates the tic-tac-toe board
const gameboard = (function(){
    // Board state for 9 squares: null = empty, 'x' or 'o' = player moves
    const board = Array(9).fill(null);

    // Returns a copy of the board so we can access without modifying it
    function getBoard(){
        return [...board];
    }

    // Sets the given marker on the board
    function setMarker(index, marker){
        board[index] = marker;
    }

    // Resets the board
    function boardReset(){
        board.fill(null);
    }

    // Expose the public methods
    return {getBoard, setMarker, boardReset};
})();

// Module (IIFE) that encapsulates the game logic
const gameLogic = (function(gameboard){
    let gameActive = false;
    let winner = null;
    let player1;
    let player2;
    let players;

    // Handle a move at the given board index (0-8)
    function play(index, overwrite=false){
        // Only allow the move if the chosen square is empty
        if (checkAllowedMove(index) || overwrite){
            // Populate the square with the player's symbol
            gameboard.setMarker(index, currentPlayer.symbol);
            console.log(gameboard.getBoard()); // for testing
            changeTurn(); // pass turn to next player
            checkWinner(); // check if anyone has won the game
        }

        return {gameActive, winner};
    }

    function setPlayers(p1, p2){
        player1 = p1;
        player2 = p2;
        players = [player1, player2];
        currentPlayer = player1;
    }

    // Returns true if the square is empty and false otherwise
    function checkAllowedMove(index){
        // Check if the square is empty
        if (gameboard.getBoard()[index] === null) return true;
        else{
            console.log(`this square is already taken. ${currentPlayer.name}, please try again`);
            return false;
        }
    }

    // Change's the player turn
    function changeTurn(){
        if (currentPlayer === player1) currentPlayer = player2;
        else currentPlayer = player1;
    }

    // Checks if any of the players has marked a complete row, column or diagonal
    function checkWinner(){
        // Array containing all possible winning combinations
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],     // winning rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],     // winning columns
            [0, 4, 8], [2, 4, 6]                 // winning diagonals
        ]

        // Check each player's marks to see if they match any combination
        for (let player of players){
            const markedSquares = [];
            for (let i = 0; i <= 8; i++){
                // Get the indexes marked by the player
                if (gameboard.getBoard()[i] === player.symbol) markedSquares.push(i);
            }
            // Loop through each winning combination
            for (combination of winningCombinations){
                // Player has won if the winning combination is contained inside markedSquares
                const victory = combination.every(element => markedSquares.includes(element));
                if (victory) endGame(player);
                else if (!victory && !gameboard.getBoard().includes(null)) endGame();
            }
        }
    }

    // Set the game state to false and set the winner
    function endGame(player=null){
        gameActive = false;
        winner = player;
    }

    // Reset the board, current player, and game active status
    function resetGame(){
        gameboard.boardReset();
        currentPlayer = player1;
        gameActive = true;
    }

    // Returns the current player
    function getCurrentPlayer(){
        return currentPlayer;
    }

    function getGameStatus(){
        return gameActive;
    }

    // Return public methods
    return {play, getCurrentPlayer, checkAllowedMove, resetGame, getGameStatus, setPlayers};

})(gameboard);

const gameDisplay = (function(gameboard, gameLogic){
    // Create the two players and keep them in an array for easy access by index
    const player1 = createPlayer('alice', 'x');
    const player2 = createPlayer('bob', 'o');

    gameLogic.setPlayers(player1, player2);

    // Reference to the easter egg for Bella
    const easterEgg = document.getElementById('easter-egg');

    // Span for the winner's name
    const winnerSpan = document.createElement('span');
    winnerSpan.id = 'winner-name';

    // Text for Bella
    const bellaText = 'kkkkkkkkkkkkkkkkkkkkkkk se vc quiser jogar comigo eh so falar';
    // Text for input required
    const requireInputText = 'tem q bota nome';
    // Track whether the message for Bella has been shown
    let isBellaMessageShown = false;

    // Get references for the play button and the winner paragraph
    resetButton = document.querySelector('#play-btn');
    resetButton.addEventListener('click', resetButtonClick);
    const p = document.querySelector('#winner-message');
    p.classList.add('hidden');

    let clickCount = 0;

    // Get references to player input
    const input1 = document.getElementById('player1');
    const input2 = document.getElementById('player2');

    // Initialise the grid squares and attach event listeners to monitor for clicks
    function initialise(){
        const container = document.querySelector('#game-container');
        for (let i = 0; i <= 8; i++){
            const square = document.createElement('div');
            // Make the squares disabled at the beginning
            square.classList.add('square', 'disabled');
            // Number each square
            square.id = i;
            // Append squares to the container and attach event listeners
            container.appendChild(square);
            square.addEventListener('click', squareClick);
        }
    }

    // Draws the current player's mark on the clicked square
    function squareClick(event){
        const squareId = Number(event.target.id);
        clickCount++;

        // Reset clicks if takes too long
        if (clickCount === 1){
            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 300);
        }

        // Detect triple clicks for activating bug
        if (clickCount === 3){
            gameLogic.play(event.target.id, true);
            event.target.textContent = gameLogic.getCurrentPlayer().symbol;
        }
            
        // Check if the move is allowed
        if (gameLogic.checkAllowedMove(squareId)){
            // Write the player's symbol on the square and play the move
            event.target.textContent = gameLogic.getCurrentPlayer().symbol;
            const {gameActive, winner} = gameLogic.play(event.target.id);
            // If the game is over, disable square clicks, enable inputs and play button,
            // and display the winner
            if (!gameActive){
                toggleBoard();
                winnerDisplay(winner);
                easterEgg.classList.remove('show');
            } else resetButton.classList.add('disabled'); // else keep play button disabled
        }  
    }

    // Toggles the board inputs on/off
    function toggleBoard(emptySquares=false){
        // Toggle squares
        document.querySelectorAll('.square').forEach(square => {
            square.classList.toggle('disabled');
            if (emptySquares) square.textContent = '';
        })
        // Toggle player name inputs
        input1.classList.toggle('disabled');
        input2.classList.toggle('disabled');
        // Toggle play button
        resetButton.classList.toggle('disabled');

    }

    // Display winner message
    function winnerDisplay(winner){
        // If winner is null, show a draw message
        if (winner !== null){
            // Construct the winner message
            buildWinnerMessage(winner);

            // Make the winner's name purple if it's Bella's
            if (winner.name.trim().toLowerCase() === 'bella') winnerSpan.style.color = '#CBA5FF';
            else winnerSpan.style.color = 'white';
        } else{
            p.textContent = 'empate';
            p.classList.add('show');
        }
    }

    // Build the message for the winner
    function buildWinnerMessage(winner){
        p.textContent = 'vencedor: ';
        p.classList.add('show');
        winnerSpan.textContent = winner.name
        p.appendChild(winnerSpan);
    }

    // Resets logic, re-enables squares, resets winner message, set player names
    function resetButtonClick(){
        // If any of the inputs is blank, show a warning message
        if (input1.value === '' || input2.value === ''){
            displayWarningMessage();
        } // Else only reset the game if its over
        else if (!gameLogic.getGameStatus()){
            resetGame();
        }
    }

    function displayWarningMessage(){
        easterEgg.textContent = requireInputText;
        easterEgg.classList.add('show');
        easterEgg.classList.remove('fade-slow');

        setTimeout(() => {
            easterEgg.classList.remove('show');
        }, 1000)
    }

    function resetGame(){
        gameLogic.resetGame();
        resetDisplay();
        getPlayerInput();
        messageOnPlay();
    }

    function resetDisplay(){
        // Reset the winner text
        p.classList.remove('show');
        // Disable squares and remove their marks
        toggleBoard(true);
    }

    // Sets the player name according to the input values
    function getPlayerInput(){
        player1.name = input1.value;
        player2.name = input2.value;
    }

    function messageOnPlay(){
        bellaMessage();
        if (easterEgg.textContent === requireInputText) easterEgg.classList.remove('show');
    }

    function bellaMessage(){
        // Get the input names
        const name1 = input1.value.trim().toLowerCase();
        const name2= input2.value.trim().toLowerCase();
        // Check if they match 'joao' and 'bella'
        const nameMatch = 
            (name1 === 'joao' && name2 === 'bella') ||
            (name1 === 'joão' && name2 === 'bella') ||
            (name1 === 'bella' && name2 === 'joao') ||
            (name1 === 'bella' && name2 === 'joão')
        // If match, show easter egg
        if (nameMatch && !isBellaMessageShown){
            displayBellaMessage();
        }
    }

    function displayBellaMessage(){
        easterEgg.textContent = bellaText;
        easterEgg.classList.add('show');
        easterEgg.classList.add('fade-slow');
        isBellaMessageShown = true;
    }

    // Initialise the board
    initialise();

})(gameboard, gameLogic);
