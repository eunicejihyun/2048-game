export { };

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

// get gameboard
const gameBoard = document.getElementById("gameboard");
const gameOver = document.getElementById("gameover");
const celebrate = document.getElementById("celebrate");
const horizontalPositionOptions = ["a", "b", "c", "d"];
const verticalPositionOptions = ["0", "1", "2", "3"];
const score = document.getElementById("score");


// instantiate gameboard
var blockPositions: blockPositionsType;

// reset the gameboard
function resetBoard() {
    celebrate.style.display = "none";
    gameOver.style.display = "none";
    gameBoard.classList.remove("gameover");
    if (blockPositions) {
        horizontalPositionOptions.forEach((position) => {
            let column = blockPositions[position];
            column.forEach((block) => {
                if (block !== null) {
                    block.piece.remove()
                }
            })
        })
    }
    blockPositions = {
        "a": [null, null, null, null],
        "b": [null, null, null, null],
        "c": [null, null, null, null],
        "d": [null, null, null, null],
    };
    score.textContent = "0"
}

// start a new game by resetting the board and generating 2 game pieces
function setupNewGame() {
    resetBoard();
    generateNewPiece();
    generateNewPiece();
}

const newGameButton = document.getElementById("newGame")
newGameButton.onclick = function () {
    setupNewGame()
}




// setup JS object to look up class corresponding to block value
const blockClass = {};
for (let i = 1; i < 13; i++) {
    let value = Math.pow(2, i);
    blockClass[value] = "block-" + String(value);
}

// check to see if a gamepiece is already in a certain position
function overlapExists(horizontalPosition: string, verticalPosition: string) {
    if (blockPositions[horizontalPosition][Number(verticalPosition)] === null) {
        return false;
    } else {
        return true;
    }
}

// recursive function - generate a random location until there is no overlap
function generateRandomLocation() {
    let randomHorizontal = horizontalPositionOptions[Math.round(Math.random() * 3)];
    let randomVertical = verticalPositionOptions[Math.round(Math.random() * 3)];

    if (overlapExists(randomHorizontal, randomVertical)) {
        return [].concat(generateRandomLocation());
    } else {
        return [randomHorizontal, randomVertical];
    }
}

// update the gameboard with the new position
function updateGameBoard(horizontalPosition: string, verticalPosition: string, gamePiece: gameBlock) {
    blockPositions[horizontalPosition][Number(verticalPosition)] = gamePiece;
}




function generateNewPiece() {
    let classes = ["gamepiece", "new"];
    var newBlockElement = document.createElement("div");
    newBlockElement.style.transition = "all 10s"
    let randomValue = Math.round(Math.random() + 1) * 2;
    newBlockElement.textContent = String(randomValue);
    classes.push(`block-${randomValue}`)

    let newGameBlock: gameBlock = {
        "piece": newBlockElement,
        "value": randomValue,
    };

    // get available location
    let newLocation = generateRandomLocation();
    let horizontalPosition = newLocation[0];
    let verticalPosition = newLocation[1];

    classes.push(`position-${horizontalPosition} position-${verticalPosition}`);
    newBlockElement.setAttribute("class", classes.join(" "));


    updateGameBoard(horizontalPosition, verticalPosition, newGameBlock);

    gameBoard ? gameBoard.appendChild(newBlockElement) : alert("no game board");

    requestAnimationFrame(() => {
        newBlockElement.classList.remove("new");
        newBlockElement.style.transition = "all 1s";
    })

    let gamePieceCount = document.querySelectorAll('.gamepiece').length;
    if (gamePieceCount === 16) {
        checkBoard()
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
function isNotNull(x: positionOptions) {
    return x !== null;
}

// after filtering nulls to shift blocks together, pad with nulls
function padWithNulls(blockGroup: positionOptions[], direction: string) {
    blockGroup = blockGroup.filter(isNotNull);

    let nullsNeeded = 4 - blockGroup.length;

    for (let i = 0; i < nullsNeeded; i++) {
        if (direction === "ArrowLeft" || direction === "ArrowDown") {
            blockGroup.push(null);
        } else {
            blockGroup.unshift(null);
        }
    }
    return blockGroup
}

type purposeOptions = "update" | "check";

// if there are blocks of the same value next to each other, then combine them
function combineBlocks(blockGroup: positionOptions[], direction: string, purpose: purposeOptions) {
    blockGroup = padWithNulls(blockGroup, direction)

    let largestBlock = 0;

    if (direction === "ArrowLeft" || direction === "ArrowDown") {
        for (let i = 0; i < 3; i++) {
            let current = blockGroup[i];
            let next = blockGroup[i + 1];
            if (current !== null && next !== null) {
                if (current.value === next.value) {

                    if (purpose === "update") {
                        current.value = current.value * 2;
                        blockGroup[i + 1].piece.remove();
                        blockGroup[i + 1] = null;
                        score.textContent = String(Number(score.textContent) + current.value);
                        if (current.value > largestBlock) {
                            largestBlock = current.value
                        }
                    } else if (purpose === "check") {
                        return []
                    }

                }
            }
        }
    } else {
        for (let i = 3; i > 0; i--) {
            let current = blockGroup[i];
            let next = blockGroup[i - 1];
            if (current !== null && next !== null) {
                if (current.value === next.value) {
                    if (purpose === "update") {
                        current.value = current.value * 2;
                        blockGroup[i - 1].piece.remove()
                        blockGroup[i - 1] = null;
                        score.textContent = String(Number(score.textContent) + current.value);
                        if (current.value > largestBlock) {
                            largestBlock = current.value
                        }
                    } else if (purpose === "check") {
                        return []
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
        blockGroup = padWithNulls(blockGroup, direction)
        return blockGroup;
    } else if (purpose === "check") {
        return [null];
    }
}

// apparently arrays can't be compared so they the OG group and new group need to be compared to see if they're the same
function createComparisonString(blockGroup: positionOptions[]) {
    let group = [];
    blockGroup.forEach((item) => {
        if (item === null) {
            group.push(0)
        } else {
            group.push(item.value)
        }
    })
    return group.join("")
}



function shiftVertical(direction: "ArrowDown" | "ArrowUp") {
    // if there aren't any blocks to shift or combine then a new piece should not be generated
    let shiftable = false;

    horizontalPositionOptions.forEach((position: string) => {
        if (!blockPositions[position].every((x: positionOptions) => x === null)) {

            let original_col_comparable = createComparisonString(blockPositions[position])
            blockPositions[position] = combineBlocks(blockPositions[position], direction, "update")
            let new_col_comparable = createComparisonString(blockPositions[position])

            // updating the board visually
            if (original_col_comparable !== new_col_comparable) {
                shiftable = true;
                let column = blockPositions[position];
                column.forEach((block: positionOptions, i: number) => {
                    if (block !== null) {
                        block.piece.setAttribute("class", `gamepiece position-${position} position-${i} block-${block.value}`);
                        block.piece.textContent = String(block.value);
                        block.piece.style.transition = "all 0.5s"
                    }
                })
            }
        }
    })
    if (shiftable) {
        generateNewPiece()
    }
}



function shiftHorizontal(direction: "ArrowLeft" | "ArrowRight") {
    // if there aren't any blocks to shift or combine then a new piece should not be generated
    let shiftable = false;
    verticalPositionOptions.forEach((verticalPositionString: string) => {
        let verticalPosition = Number(verticalPositionString);

        let row = [];

        // produces an error "TS2550: Property 'values' does not exist on type 'ObjectConstructor'. ..."
        // updating tsconfig.json doesn't fix the issue
        // Object.values(blockPositions).forEach(column => {
        //     row.push(column[position]);
        // })

        horizontalPositionOptions.forEach((horizontalPosition: string) => {
            row.push(blockPositions[horizontalPosition][verticalPosition])
        })

        if (!row.every((x: positionOptions) => x === null)) {

            let original_row_comparable = createComparisonString(row)
            row = combineBlocks(row, direction, "update");
            let new_row_comparable = createComparisonString(row)

            // updating the board visually
            if (original_row_comparable !== new_row_comparable) {
                shiftable = true;
                horizontalPositionOptions.forEach((horizontalPosition: string, i: number) => {
                    let block = row[i];
                    if (block !== null) {
                        block.piece.setAttribute("class", `gamepiece position-${horizontalPosition} position-${verticalPosition} block-${block.value}`);
                        block.piece.textContent = String(block.value);
                        block.piece.style.transition = "all 0.5s"
                    }
                    blockPositions[horizontalPosition][verticalPosition] = block;
                })
            }

        }
    })
    if (shiftable) {
        generateNewPiece()
    }
}



function checkBoard() {
    console.log("CHECKING BOARD")

    for (let i = 0; i < verticalPositionOptions.length; i++ ) {
        let verticalPosition = Number(verticalPositionOptions[i]);
        let row = [];
        horizontalPositionOptions.forEach((horizontalPosition: string) => {
            row.push(blockPositions[horizontalPosition][verticalPosition])
        })

        let check = combineBlocks(row, "ArrowLeft", "check");
        if (check.length === 0) {
            console.log("blocks combinable to the left")
            return true;
            break;
        }

        check = combineBlocks(row, "ArrowRight", "check");
        if (check.length === 0) {
            console.log("blocks combinable to the right")
            return true;
        }
    }

    for (let i=0; i < horizontalPositionOptions.length; i++) {
        let position = horizontalPositionOptions[i];
        let check = combineBlocks(blockPositions[position], "ArrowUp", "check");
        if (check.length === 0) {
            console.log("blocks combinable upwards")
            return true;
        }
        check = combineBlocks(blockPositions[position], "ArrowDown", "check");
        if (check.length === 0) {
            console.log("blocks combinable downwards")
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
