"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// instantiate gameboard
var blockPositions;
// reset the gameboard
function resetBoard() {
    blockPositions = {
        "a": [null, null, null, null],
        "b": [null, null, null, null],
        "c": [null, null, null, null],
        "d": [null, null, null, null],
    };
}
// get gameboard
var gameBoard = document.getElementById("gameboard");
var horizontalPositionOptions = ["a", "b", "c", "d"];
var verticalPositionOptions = ["0", "1", "2", "3"];
// setup JS object to look up class corresponding to block value
var blockClass = {};
for (var i = 1; i < 13; i++) {
    var value = Math.pow(2, i);
    blockClass[value] = "block-" + String(value);
}
// check to see if a gamepiece is already in a certain position
function overlapExists(horizontalPosition, verticalPosition) {
    if (blockPositions[horizontalPosition][Number(verticalPosition)] === null) {
        return false;
    }
    else {
        return true;
    }
}
// recursive function - generate a random location until there is no overlap
function generateRandomLocation() {
    var randomHorizontal = horizontalPositionOptions[Math.round(Math.random() * 3)];
    var randomVertical = verticalPositionOptions[Math.round(Math.random() * 3)];
    if (overlapExists(randomHorizontal, randomVertical)) {
        return '' + generateRandomLocation();
    }
    else {
        return [randomHorizontal, randomVertical];
    }
}
// update the gameboard with the new position
function updateGameBoard(horizontalPosition, verticalPosition, gamePiece) {
    blockPositions[horizontalPosition][Number(verticalPosition)] = gamePiece;
}
function generateNewPiece() {
    var classes = ["gamepiece"];
    var newBlockElement = document.createElement("div");
    var randomValue = Math.round(Math.random() + 1) * 2;
    newBlockElement.textContent = String(randomValue);
    classes.push("block-".concat(randomValue));
    var newGameBlock = {
        "piece": newBlockElement,
        "value": randomValue,
    };
    // get available location
    var newLocation = generateRandomLocation();
    var horizontalPosition = newLocation[0];
    var verticalPosition = newLocation[1];
    classes.push("position-".concat(horizontalPosition, " position-").concat(verticalPosition));
    newBlockElement.setAttribute("class", classes.join(" "));
    updateGameBoard(horizontalPosition, verticalPosition, newGameBlock);
    gameBoard ? gameBoard.appendChild(newBlockElement) : alert("no game board");
}
// start a new game by resetting the board and generating 2 game pieces
function setupNewGame() {
    resetBoard();
    generateNewPiece();
    generateNewPiece();
}
document.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            alert("left");
            break;
        case "ArrowUp":
            shiftVertical(e.key);
            break;
        case "ArrowRight":
            alert("right");
            break;
        case "ArrowDown":
            shiftVertical(e.key);
            break;
    }
};
function isNotNull(x) {
    return x !== null;
}
function shiftVertical(direction) {
    horizontalPositionOptions.forEach(function (position) {
        console.log(position);
        if (!blockPositions[position].every(function (x) { return x === null; })) {
            blockPositions[position] = blockPositions[position].filter(isNotNull);
            var nullsNeeded = 4 - blockPositions[position].length;
            console.log(blockPositions[position]);
            for (var i = 0; i < nullsNeeded; i++) {
                if (direction === "ArrowDown") {
                    blockPositions[position].push(null);
                }
                else {
                    blockPositions[position].unshift(null);
                }
            }
            console.log(blockPositions[position]);
            var column = blockPositions[position];
            column.forEach(function (block, i) {
                if (block !== null) {
                    block.piece.setAttribute("class", "gamepiece position-".concat(position, " position-").concat(i, " block-").concat(block.value));
                }
            });
        }
    });
}
setupNewGame();
