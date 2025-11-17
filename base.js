// Factory function: creates a player with a name and a board symbol (like 'x' or 'o')
function createPlayer(name, symbol){
    return {name, symbol};
}

// Create the two players and keep them in an array for easy access by index
const player1 = createPlayer('alice', 'x');
const player2 = createPlayer('bob', 'o');
const players = [player1, player2];

// Module (IIFE) that encapsulates the tic-tac-toe board and game logic
const gameboard = (function(){
    // Board state for 9 squares: null = empty, 'x' or 'o' = player moves
    const board = Array(9).fill(null);
    let currentPlayer = player1

    // Handle a move at the given board index (0-8)
    function play(index){
        // Only allow the move if the chosen square is empty
        if (checkAllowedMove(index)){
            // Populate the square with the player's symbol
            board[index] = currentPlayer.symbol;
        } else {
            console.log(`This square is already taken. Player ${currentPlayer.name}, please play again`);
        }
    
    }

    // Returns true if the square is empty and false otherwise
    function checkAllowedMove(index){
        if (board[index] === null) return true;
        return false;
    }

    // TODO: add checkWinner(), win(player), and reset() methods
    // Expose the public methods
    return {play};
})();
