"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// get gameboard
var gameBoard = document.getElementById("gameboard");
var gameOver = document.getElementById("gameover");
var celebrate = document.getElementById("celebrate");
var horizontalPositionOptions = ["a", "b", "c", "d"];
var verticalPositionOptions = ["0", "1", "2", "3"];
var score = document.getElementById("score");
// instantiate gameboard
var blockPositions;
// reset the gameboard
function resetBoard() {
    celebrate.style.display = "none";
    gameOver.style.display = "none";
    gameBoard.classList.remove("gameover");
    if (blockPositions) {
        horizontalPositionOptions.forEach(function (position) {
            var column = blockPositions[position];
            column.forEach(function (block) {
                if (block !== null) {
                    block.piece.remove();
                }
            });
        });
    }
    blockPositions = {
        "a": [null, null, null, null],
        "b": [null, null, null, null],
        "c": [null, null, null, null],
        "d": [null, null, null, null],
    };
    score.textContent = "0";
}
// start a new game by resetting the board and generating 2 game pieces
function setupNewGame() {
    resetBoard();
    generateNewPiece();
    generateNewPiece();
}
var newGameButton = document.getElementById("newGame");
newGameButton.onclick = function () {
    setupNewGame();
};
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
        return [].concat(generateRandomLocation());
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
    var classes = ["gamepiece", "new"];
    var newBlockElement = document.createElement("div");
    newBlockElement.style.transition = "all 10s";
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
    requestAnimationFrame(function () {
        newBlockElement.classList.remove("new");
        newBlockElement.style.transition = "all 1s";
    });
    var gamePieceCount = document.querySelectorAll('.gamepiece').length;
    if (gamePieceCount === 16) {
        checkBoard();
    }
}
document.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            shiftHorizontal(e.key);
            break;
        case "ArrowUp":
            shiftVertical(e.key);
            break;
        case "ArrowRight":
            shiftHorizontal(e.key);
            break;
        case "ArrowDown":
            shiftVertical(e.key);
            break;
    }
};
// FUNCTIONS USED IN SHIFT FUNCTIONS
function isNotNull(x) {
    return x !== null;
}
// after filtering nulls to shift blocks together, pad with nulls
function padWithNulls(blockGroup, direction) {
    blockGroup = blockGroup.filter(isNotNull);
    var nullsNeeded = 4 - blockGroup.length;
    for (var i = 0; i < nullsNeeded; i++) {
        if (direction === "ArrowLeft" || direction === "ArrowDown") {
            blockGroup.push(null);
        }
        else {
            blockGroup.unshift(null);
        }
    }
    return blockGroup;
}
// if there are blocks of the same value next to each other, then combine them
function combineBlocks(blockGroup, direction, purpose) {
    blockGroup = padWithNulls(blockGroup, direction);
    var largestBlock = 0;
    if (direction === "ArrowLeft" || direction === "ArrowDown") {
        for (var i = 0; i < 3; i++) {
            var current = blockGroup[i];
            var next = blockGroup[i + 1];
            if (current !== null && next !== null) {
                if (current.value === next.value) {
                    if (purpose === "update") {
                        current.value = current.value * 2;
                        blockGroup[i + 1].piece.remove();
                        blockGroup[i + 1] = null;
                        score.textContent = String(Number(score.textContent) + current.value);
                        if (current.value > largestBlock) {
                            largestBlock = current.value;
                        }
                    }
                    else if (purpose === "check") {
                        return [];
                    }
                }
            }
        }
    }
    else {
        for (var i = 3; i > 0; i--) {
            var current = blockGroup[i];
            var next = blockGroup[i - 1];
            if (current !== null && next !== null) {
                if (current.value === next.value) {
                    if (purpose === "update") {
                        current.value = current.value * 2;
                        blockGroup[i - 1].piece.remove();
                        blockGroup[i - 1] = null;
                        score.textContent = String(Number(score.textContent) + current.value);
                        if (current.value > largestBlock) {
                            largestBlock = current.value;
                        }
                    }
                    else if (purpose === "check") {
                        return [];
                    }
                }
            }
        }
    }
    if (largestBlock > 1024) {
        celebrate.style.display = "block";
        celebrate.click();
    }
    if (purpose === "update") {
        blockGroup = padWithNulls(blockGroup, direction);
        return blockGroup;
    }
    else if (purpose === "check") {
        return [null];
    }
}
// apparently arrays can't be compared so they the OG group and new group need to be compared to see if they're the same
function createComparisonString(blockGroup) {
    var group = [];
    blockGroup.forEach(function (item) {
        if (item === null) {
            group.push(0);
        }
        else {
            group.push(item.value);
        }
    });
    return group.join("");
}
function shiftVertical(direction) {
    // if there aren't any blocks to shift or combine then a new piece should not be generated
    var shiftable = false;
    horizontalPositionOptions.forEach(function (position) {
        if (!blockPositions[position].every(function (x) { return x === null; })) {
            var original_col_comparable = createComparisonString(blockPositions[position]);
            blockPositions[position] = combineBlocks(blockPositions[position], direction, "update");
            var new_col_comparable = createComparisonString(blockPositions[position]);
            // updating the board visually
            if (original_col_comparable !== new_col_comparable) {
                shiftable = true;
                var column = blockPositions[position];
                column.forEach(function (block, i) {
                    if (block !== null) {
                        block.piece.setAttribute("class", "gamepiece position-".concat(position, " position-").concat(i, " block-").concat(block.value));
                        block.piece.textContent = String(block.value);
                        block.piece.style.transition = "all 0.5s";
                    }
                });
            }
        }
    });
    if (shiftable) {
        generateNewPiece();
    }
}
function shiftHorizontal(direction) {
    // if there aren't any blocks to shift or combine then a new piece should not be generated
    var shiftable = false;
    verticalPositionOptions.forEach(function (verticalPositionString) {
        var verticalPosition = Number(verticalPositionString);
        var row = [];
        // produces an error "TS2550: Property 'values' does not exist on type 'ObjectConstructor'. ..."
        // updating tsconfig.json doesn't fix the issue
        // Object.values(blockPositions).forEach(column => {
        //     row.push(column[position]);
        // })
        horizontalPositionOptions.forEach(function (horizontalPosition) {
            row.push(blockPositions[horizontalPosition][verticalPosition]);
        });
        if (!row.every(function (x) { return x === null; })) {
            var original_row_comparable = createComparisonString(row);
            row = combineBlocks(row, direction, "update");
            var new_row_comparable = createComparisonString(row);
            // updating the board visually
            if (original_row_comparable !== new_row_comparable) {
                shiftable = true;
                horizontalPositionOptions.forEach(function (horizontalPosition, i) {
                    var block = row[i];
                    if (block !== null) {
                        block.piece.setAttribute("class", "gamepiece position-".concat(horizontalPosition, " position-").concat(verticalPosition, " block-").concat(block.value));
                        block.piece.textContent = String(block.value);
                        block.piece.style.transition = "all 0.5s";
                    }
                    blockPositions[horizontalPosition][verticalPosition] = block;
                });
            }
        }
    });
    if (shiftable) {
        generateNewPiece();
    }
}
function checkBoard() {
    console.log("CHECKING BOARD");
    var _loop_1 = function (i) {
        var verticalPosition = Number(verticalPositionOptions[i]);
        var row = [];
        horizontalPositionOptions.forEach(function (horizontalPosition) {
            row.push(blockPositions[horizontalPosition][verticalPosition]);
        });
        var check = combineBlocks(row, "ArrowLeft", "check");
        if (check.length === 0) {
            console.log("blocks combinable to the left");
            return { value: true };
            return "break";
        }
        check = combineBlocks(row, "ArrowRight", "check");
        if (check.length === 0) {
            console.log("blocks combinable to the right");
            return { value: true };
        }
    };
    for (var i = 0; i < verticalPositionOptions.length; i++) {
        var state_1 = _loop_1(i);
        if (typeof state_1 === "object")
            return state_1.value;
        if (state_1 === "break")
            break;
    }
    for (var i = 0; i < horizontalPositionOptions.length; i++) {
        var position = horizontalPositionOptions[i];
        var check = combineBlocks(blockPositions[position], "ArrowUp", "check");
        if (check.length === 0) {
            console.log("blocks combinable upwards");
            return true;
        }
        check = combineBlocks(blockPositions[position], "ArrowDown", "check");
        if (check.length === 0) {
            console.log("blocks combinable downwards");
            return true;
        }
    }
    endGame();
}
function endGame() {
    gameOver.style.display = "block";
    gameBoard.classList.add("gameover");
}
setupNewGame();
