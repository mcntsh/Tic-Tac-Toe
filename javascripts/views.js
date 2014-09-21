(function(View, Module, Util) {

    'use strict';

    //\\//\\//\\//\\//\\//\\//\\
    // Views
    // ------------------------
    // Views are the frontend of this application. They control the interface and
    // handle the communication between the user and the 'Module' layer.
    //\\//\\//\\//\\//\\//\\//\\

    View.TicTacToe = (function() {

        var self = {};

        self.game = Module.TicTacToe; // Pull in the module that needs to be interfaced with

        // Pre-define the DOM elements that we want to use within our code
        self.$el = {};
        self.$el.context     = Util.DOM.qs('#tictactoe-application');
        self.$el.playerSides = Util.DOM.qsa('.player-container', self.$el.context);
        self.$el.player1     = Util.DOM.qs('#player1', self.$el.playerSides);
        self.$el.player2     = Util.DOM.qs('#player2', self.$el.playerSides);
        self.$el.gameCont    = Util.DOM.qs('#game-container', self.$el.context);
        self.$el.gameTable   = Util.DOM.qs('#game-table', self.$el.gameCont);
        self.$el.gameCell    = Util.DOM.qsa('#game-table td', self.$el.gameTable);
        self.$el.actionBtns  = Util.DOM.qsa('#game-actions .btn', self.$el.gameCont);
        self.$el.startBtn    = Util.DOM.qs('#start-button', self.$el.actionBtns);
        self.$el.restartBtn  = Util.DOM.qs('#restart-button', self.$el.actionBtns);
        self.$el.againBtn    = Util.DOM.qs('#again-button', self.$el.actionBtns);

        var addPoint = function() {

            if(self.game.gameStatus !== self.game.const.STATUS_IN_PROGRESS) {
                return false;
            }

            var $td = this;

            var $row        = Util.DOM.parent($td, 'tr');
            var playerTurn  = self.game.playerTurn;
            var pointCoords = { x: $row.dataset.row, y: $td.dataset.col };

            if(self.game.addPoint(pointCoords)) {
                Util.DOM.addClass($td, playerTurn);
            }

            updateViewState();

        };

         var activateApplication = function() {

            if(!Util.DOM.hasClass(self.$el.context)) {
                Util.DOM.addClass(self.$el.context, 'active');
            }

        };

        var updateTurnIndicator = function() {

            var $side = (self.game.playerTurn === self.game.const.PLAYER_1) ?
                        Util.DOM.qs('#player1') :
                        Util.DOM.qs('#player2');

            Util.DOM.removeClass(self.$el.playerSides, 'active');
            Util.DOM.addClass($side, 'active');

        };

        var highlightWinningPoints = function() {

            var winningCoords = self.game.getWinningCoords();

            if(!winningCoords) {
                return false;
            }

            for(var i = 0; i < winningCoords.x.length; i++) {
                var $row  = Util.DOM.qs('.row-' + winningCoords.x[i], self.$el.gameTable);
                var $cell = Util.DOM.qs('.col-' + winningCoords.y[i], $row);

                Util.DOM.addClass($cell, 'active');
            }

        };

        var updateActionButton = function($button) {

            Util.DOM.removeClass(self.$el.actionBtns, 'active');
            Util.DOM.addClass($button, 'active');

        };

        var updateViewState = function() {

            switch(self.game.gameStatus) {
                case self.game.const.STATUS_IN_PROGRESS:
                    activateApplication();
                    updateActionButton(self.$el.restartBtn);
                    updateTurnIndicator();
                    break;
                case self.game.const.STATUS_WINNER:
                    updateActionButton(self.$el.againBtn);
                    highlightWinningPoints();
                    break;
                case self.game.const.STATUS_TIE:
                    updateActionButton(self.$el.againBtn);
                    break;
            }

        };

        var restartGame = function() {

            Util.DOM.removeClass(self.$el.gameCell, self.game.const.PLAYER_1);
            Util.DOM.removeClass(self.$el.gameCell, self.game.const.PLAYER_2);
            Util.DOM.removeClass(self.$el.gameCell, 'active');

            if(self.game.restartGame()) updateViewState();

        };

        var startGame = function() {

            if(self.game.startGame()) updateViewState();

        };


        (function() {

            // The init scope. Here's where we'll define all of the even listeners

            Util.DOM.on(self.$el.gameCell, 'click', addPoint);
            Util.DOM.on(self.$el.startBtn, 'click', startGame);
            Util.DOM.on(self.$el.restartBtn, 'click', restartGame);
            Util.DOM.on(self.$el.againBtn, 'click', restartGame);

        })();

        return self;

    })();


})(App.View, App.Module, App.Util);
