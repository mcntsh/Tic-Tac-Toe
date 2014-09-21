(function(Module, Util) {

    'use strict';

    //\\//\\//\\//\\//\\//\\//\\
    // Modules
    // ------------------------
    // Modules are the 'backbone' this application. They control the logic
    // and the state, and they correspond directly to the 'View' layer.
    //\\//\\//\\//\\//\\//\\//\\

    Module.TicTacToe = (function() {

        var self = {}; // What all public variables will be bound to

        // Constants

        self.const = {
            PLAYER_1           : 'x',
            PLAYER_2           : 'o',
            STATUS_NOT_STARTED : 1,
            STATUS_IN_PROGRESS : 2,
            STATUS_WINNER      : 3,
            STATUS_TIE         : 4,
        };

        // Game state

        self.gameStatus = self.const.STATUS_NOT_STARTED;
        self.playerTurn = self.const.PLAYER_1;

        var winningCoords = null; // If theres a win the coords will be stored here.
        var moveCount = 0; // Keep track of moves so we can throw a tie.

        // The playerBoards represent where spaces are marked. Both players have their own board.
        var playerBoards = {
            x: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            o: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
        };

        var checkWinner = function(posX, posY) {

            var playerBoard = playerBoards[self.playerTurn];
            var boardSize   = playerBoard.length;

            moveCount++;

            // Checks if there is a point on a given space, and takes a count from the iterator below.
            // If the count is the same as the board size we know that there has been a sequence
            // up until that point (1, 2, 3), and can assure the player has won.
            var checkSequence = function(x, y, count) {

                if(!playerBoard[x][y])        return false; // sequence incomplete
                if(count === (boardSize - 1)) return true;  // sequence complete
                return;

            };

            var checkCols     = true;
            var checkRows     = true;
            var checkDiag     = true;
            var checkAntiDiag = true;

            // Store the points we've checked for later use
            var checkedCoords = {
                cols     : { x: [], y: [] },
                rows     : { x: [], y: [] },
                diag     : { x: [], y: [] },
                antiDiag : { x: [], y: [] },
            };

            // Iterate over the board and start checking for sequences
            for(var i = 0; i < boardSize; i++) {
                var seq;

                // Columns
                if(checkCols) {
                    seq = checkSequence((posX - 1), i, i);

                    checkedCoords.cols.x.push(posX);
                    checkedCoords.cols.y.push(i + 1);

                    if(seq === false)     checkCols = false;
                    else if(seq === true) winningCoords = checkedCoords.cols;
                }

                // Rows
                if(checkRows) {
                    seq = checkSequence(i, (posY - 1), i);

                    checkedCoords.rows.x.push(i + 1);
                    checkedCoords.rows.y.push(posY);

                    if(seq === false)     checkRows = false;
                    else if(seq === true) winningCoords = checkedCoords.rows;
                }

                // Diags
                if(checkDiag) {
                    seq = checkSequence(i, i, i);

                    checkedCoords.diag.x.push(i + 1);
                    checkedCoords.diag.y.push(i + 1);

                    if(seq === false)     checkDiag = false;
                    else if(seq === true) winningCoords = checkedCoords.diag;
                }

                // Anti-Diag
                if(checkAntiDiag) {
                    seq = checkSequence(i, ((boardSize - 1) - i), i);

                    checkedCoords.antiDiag.x.push(i + 1);
                    checkedCoords.antiDiag.y.push((boardSize - i));

                    if(seq === false)     checkAntiDiag = false;
                    else if(seq === true) winningCoords = checkedCoords.antiDiag;
                }
            }

            if(moveCount === Math.pow(boardSize, 2)) {
                self.gameStatus = self.const.STATUS_TIE;
            }

            return winningCoords;

        };

        var pointAvailable = function(pointCoords) {

            if(playerBoards.x[pointCoords.x - 1][pointCoords.y - 1] ||
                playerBoards.o[pointCoords.x - 1][pointCoords.y - 1]) {
                return false;
            }

            return true;

        };

        var toggleTurn = function() {

            self.playerTurn = (self.playerTurn === self.const.PLAYER_1) ?
                                self.const.PLAYER_2 :
                                self.const.PLAYER_1;

        };

        // Public methods

        self.getWinningCoords = function() {

            if(!winningCoords) return false;

            return winningCoords;

        };

        self.addPoint = function(pointCoords) {

            // If the game is over, or the point they're trying to plot isn't available
            // do not continue to plot it!
            if(self.gameStatus !== self.const.STATUS_IN_PROGRESS ||
                !pointAvailable(pointCoords)) {
                return false;
            }

            // Plot the point in memory
            playerBoards[self.playerTurn][pointCoords.x - 1][pointCoords.y - 1] = true;

            // If the move hasn't won the game, continue.
            if(checkWinner(pointCoords.x, pointCoords.y)) {
                self.gameStatus = self.const.STATUS_WINNER;
            }
            else {
                toggleTurn();
            }

            return true;

        };

        self.restartGame = function() {

            // Reset the player boards
            for(var player in playerBoards) {
                if(playerBoards.hasOwnProperty(player)) {
                    for(var i = 0; i < playerBoards[player].length; i++) {
                        playerBoards[player][i].length = 0;
                        playerBoards[player][i]        = [0, 0, 0];
                    }
                }
            }

            winningCoords = null;
            moveCount     = null;

            return self.startGame();

        };

        self.startGame = function() {

            self.gameStatus = self.const.STATUS_IN_PROGRESS;
            self.playerTurn = self.const.PLAYER_1; // Player 1 goes first

            return true;

        };

        return self;

    })();

})(App.Module, App.Util);
