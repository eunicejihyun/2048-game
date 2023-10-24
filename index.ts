export {}

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

// instantiate gameboard
var blockPositions: blockPositionsType;

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
const gameBoard = document.getElementById("gameboard");
const horizontalPositionOptions = ["a", "b", "c", "d"];
const verticalPositionOptions = ["0", "1", "2", "3"]

// setup JS object to look up class corresponding to block value
const blockClass = {}
for (let i = 1; i < 13; i++) {
    let value = Math.pow(2, i);
    blockClass[value] = "block-" + String(value);
}

// check to see if a gamepiece is already in a certain position
function overlapExists(horizontalPosition: string, verticalPosition: string) {
    if (blockPositions[horizontalPosition][Number(verticalPosition)] === null) {
        return false
    } else {
        return true
    }
}

// recursive function - generate a random location until there is no overlap
function generateRandomLocation() {
    let randomHorizontal = horizontalPositionOptions[Math.round(Math.random() * 3)];
    let randomVertical = verticalPositionOptions[Math.round(Math.random() * 3)];

    if (overlapExists(randomHorizontal, randomVertical)) {
        return '' + generateRandomLocation()
    } else {
        return [randomHorizontal, randomVertical];
    }
}

// update the gameboard with the new position
function updateGameBoard(horizontalPosition: string, verticalPosition: string, gamePiece: gameBlock) {
    blockPositions[horizontalPosition][Number(verticalPosition)] = gamePiece
}


function generateNewPiece() {
    let classes = ["gamepiece"];
    var newBlockElement = document.createElement("div");
    let randomValue = Math.round(Math.random() + 1) * 2;
    newBlockElement.textContent = String(randomValue);
    classes.push(`block-${randomValue}`)

    let newGameBlock: gameBlock = {
        "piece": newBlockElement,
        "value": randomValue,
    }

    // get available location
    let newLocation = generateRandomLocation()
    let horizontalPosition = newLocation[0]
    let verticalPosition = newLocation[1]
    classes.push(`position-${horizontalPosition} position-${verticalPosition}`);
    newBlockElement.setAttribute("class", classes.join(" "))

    updateGameBoard(horizontalPosition, verticalPosition, newGameBlock)

    gameBoard ? gameBoard.appendChild(newBlockElement) : alert("no game board")
}

// start a new game by resetting the board and generating 2 game pieces
function setupNewGame() {
    resetBoard()
    generateNewPiece()
    generateNewPiece()
}

document.onkeydown = function (e) {
    switch (e.key) {
        case "ArrowLeft":
            alert("left")
            break;
        case "ArrowUp":
            shiftVertical(e.key)
            break;
        case "ArrowRight":
            alert("right")
            break;
        case "ArrowDown":
            shiftVertical(e.key)
            break;
    }
};

function isNotNull(x: positionOptions) {
    return x !== null;
}


function shiftVertical(direction: "ArrowDown" | "ArrowUp") {

    horizontalPositionOptions.forEach((position: string) => {
        console.log(position)

        if (!blockPositions[position].every((x: positionOptions) => x === null)) {

            

            blockPositions[position] = blockPositions[position].filter(isNotNull)
            let nullsNeeded = 4 - blockPositions[position].length
            console.log(blockPositions[position])
            for (let i = 0; i < nullsNeeded; i++) {
                if (direction === "ArrowDown") {
                    blockPositions[position].push(null)
                } else {
                    blockPositions[position].unshift(null)
                }
            }

            console.log(blockPositions[position])

            let column = blockPositions[position]

            column.forEach((block: positionOptions, i: number) => {
                if (block !== null) {
                    block.piece.setAttribute("class", `gamepiece position-${position} position-${i} block-${block.value}`)
                }
            })
        }


    })
}


setupNewGame()
