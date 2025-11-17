// Factory function: creates a player with a name and a board symbol (like 'x' or 'o')
function createPlayer(name, symbol){
    return {name, symbol};
}

// Create the two players and keep them in an array for easy access by index
const player1 = createPlayer('alice', 'x');
const player2 = createPlayer('bob', 'o');
const players = [player1, player2];

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
    let currentPlayer = player1;
    let gameActive = true;
    let winner = null;

    // Handle a move at the given board index (0-8)
    function play(index){
        // Only allow the move if the chosen square is empty
        if (checkAllowedMove(index)){
            // Populate the square with the player's symbol
            gameboard.setMarker(index, currentPlayer.symbol);
            console.log(gameboard.getBoard()); // for testing
            changeTurn(); // pass turn to next player
            checkWinner(); // check if anyone has won the game
        }

        return {gameActive, winner};
    }

    // Returns true if the square is empty and false otherwise
    function checkAllowedMove(index){
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
            [0, 1, 2], [3, 4, 5], [6, 7, 8],    // winning rows
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
                if (victory) winGame(player);
            }
        }
    }

    // Sends a message stating which player won the game
    function winGame(player){
        console.log(`player ${player.name} has won`);
        gameActive = false;
        winner = player;
    }

    // Resets the game
    function resetGame(){
        gameboard.boardReset();
        currentPlayer = player1;
        gameActive = true;
    }

    // Returns the current player
    function getCurrentPlayer(){
        return currentPlayer;
    }

    // Return public methods
    return {play, getCurrentPlayer, checkAllowedMove, resetGame};

})(gameboard);

const gameDisplay = (function(gameboard, gameLogic){

    resetButton = document.querySelector('#play-btn');
    resetButton.addEventListener('click', resetButtonClick);
    const p = document.querySelector('#winner-message');

    // Initialise the grid squares and attach event listeners to monitor for clicks
    function initialise(){
        const container = document.querySelector('#game-container');
        for (let i = 0; i <= 8; i++){
            const square = document.createElement('div');
            square.classList.add('square');
            square.id = i;
            container.appendChild(square);
            square.addEventListener('click', squareClick);
        }
    }

    // Draws the current player's mark on the clicked square
    function squareClick(event){
        const squareId = Number(event.target.id);
        // Check if the move is allowed
        if (gameLogic.checkAllowedMove(squareId)){
            // Write the player's symbol on the square and play the move
            event.target.textContent = gameLogic.getCurrentPlayer().symbol;
            const {gameActive, winner} = gameLogic.play(event.target.id);
            // If the game is over, disable square clicks and display the winner
            if (!gameActive){
                disableSquares();
                winnerDisplay(winner);
                resetButton.classList.remove('disabled');
            } else resetButton.classList.add('disabled');
        }  
    }

    // Disables mouse clicks on the board squares
    function disableSquares(){
        document.querySelectorAll('.square').forEach(square => {
            square.classList.add('disabled');
        })
    }

    // Display winner message
    function winnerDisplay(winner){
        p.textContent = `winner: ${winner.name}`;
        console.log(winner);
    }

    // Resets logic, re-enables squares, resets winner message
    function resetButtonClick(){
        gameLogic.resetGame();
        document.querySelectorAll('.square').forEach(square => {
            square.classList.toggle('disabled');
            square.textContent = '';
        });
        p.textContent = '';
    }

    initialise(); // initialise the board

})(gameboard, gameLogic);
