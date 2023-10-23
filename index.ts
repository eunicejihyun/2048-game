interface gameBlock {
    "piece": HTMLElement;
    "value": number;
}

type positionOptions = null | gameBlock;

interface blockPositionsType {
    "a": positionOptions[];
    "b": positionOptions[];
    "c": positionOptions[];
    "d": positionOptions[];
}

// instantiate empty gameboard positions
var blockPositions: blockPositionsType = {
    "a": [null, null, null, null],
    "b": [null, null, null, null],
    "c": [null, null, null, null],
    "d": [null, null, null, null],
};

// get gameboard
const gameBoard = document.getElementById("gameboard");
const horizontalPositionOptions = ["a", "b", "c", "d"];
const verticalPositionOptions = ["1", "2", "3", "4"]

// setup JS object to look up class corresponding to block value
const blockClass = {}
for (let i = 1; i < 13; i++) {
    let value = Math.pow(2, i);
    blockClass[value] = "block-" + String(value);
}
console.log(blockClass);

function overlapExists(horizontalPosition: string, verticalPosition: string) {
    // console.log(blockPositions[horizontalPosition][Number(verticalPosition)-1] === null)
    if (blockPositions[horizontalPosition][Number(verticalPosition)-1] === null ) {
        return false
    } else {
        return true
    }
}

function generateRandomCoordinates(){
    let randomHorizontal = horizontalPositionOptions[Math.round(Math.random() * 3)];
    let randomVertical = verticalPositionOptions[Math.round(Math.random() * 3)];
    return [randomHorizontal, randomVertical]
}

function generateLocation() {
    let randomLocation = generateRandomCoordinates()

    if (overlapExists(randomLocation[0], randomLocation[1])) {
        // alert("same location!")
        generateRandomLocation()
    } else {
        return `position-${randomHorizontal} position-${randomVertical}`;
    }
}

function updateGameBoard(blockPositions: blockPositionsType) {

}


function generateNewPiece() {
    let classes = ["gamepiece"];
    var newBlockElement = document.createElement("div");
    let randomValue = String(Math.round(Math.random() + 1) * 2);
    newBlockElement.textContent = randomValue;
    classes.push(`block-${randomValue}`)
    classes.push(generateRandomLocation());
    newBlockElement.setAttribute("class", classes.join(" "))

    gameBoard ? gameBoard.appendChild(newBlockElement) : alert("no game board")
}


generateNewPiece()

generateNewPiece()