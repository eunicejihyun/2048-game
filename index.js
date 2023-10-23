// instantiate empty gameboard positions
var blockPositions = {
    "a": [null, null, null, null],
    "b": [null, null, null, null],
    "c": [null, null, null, null],
    "d": [null, null, null, null],
};
// get gameboard
var gameBoard = document.getElementById("gameboard");
var horizontalPositionOptions = ["a", "b", "c", "d"];
var verticalPositionOptions = ["1", "2", "3", "4"];
// setup JS object to look up class corresponding to block value
var blockClass = {};
for (var i = 1; i < 13; i++) {
    var value = Math.pow(2, i);
    blockClass[value] = "block-" + String(value);
}
console.log(blockClass);
function overlapExists(horizontalPosition, verticalPosition) {
    console.log(blockPositions[horizontalPosition][Number(verticalPosition) - 1] === null);
    if (blockPositions[horizontalPosition][Number(verticalPosition) - 1] === null) {
        return false;
    }
    else {
        return true;
    }
}
function generateRandomLocation() {
    var randomHorizontal = horizontalPositionOptions[Math.round(Math.random() * 3)];
    var randomVertical = verticalPositionOptions[Math.round(Math.random() * 3)];
    if (overlapExists(randomHorizontal, randomVertical)) {
        // alert("same location!")
        generateRandomLocation();
        return;
    }
    else {
        return "position-".concat(randomHorizontal, " position-").concat(randomVertical);
    }
}
function generateNewPiece() {
    var classes = ["gamepiece"];
    var newBlockElement = document.createElement("div");
    var randomValue = String(Math.round(Math.random() + 1) * 2);
    newBlockElement.textContent = randomValue;
    classes.push("block-".concat(randomValue));
    classes.push(generateRandomLocation());
    newBlockElement.setAttribute("class", classes.join(" "));
    gameBoard ? gameBoard.appendChild(newBlockElement) : alert("no game board");
}
generateNewPiece();
generateNewPiece();
