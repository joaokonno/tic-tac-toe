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

    // Current player: -1 = player1, 1 = player2
    let playerTurn = -1; 

    // Handle a move at the given board index (0-8)
    function play(index){
        // Only allow the move if the chosen square is empty
        checkAllowedMove(index);
        // TODO: implement behaviour based on the value returned by checkAllowedMove
    }

    // Returns true if the move is valid and false otherwise
    function checkAllowedMove(index){
        // TODO: implement validation logic
    }

    // TODO: add checkWinner(), win(player), and reset() methods

    // Expose the public methods
    return {play,};
})();