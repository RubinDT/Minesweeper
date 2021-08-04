import React from 'react';

//separate logic from what gets rendered

class Gameboard extends React.Component {
    constructor(props) {
        super(props)
        //let boardSize=props.boardSize //will change this to a map structure so can pass "small" etc.
        //let minePercentage = props.minePercentage//will change this to a map structure so can pass "easy" etc.

        this.state = {
            minePercentage: 10,//will later implement a difficulty setting to alter this
            squareInfo: this.makeInitialBoardSquareInfo(props.boardSize, props.minePercentage),
            gameIsOver: false,
            gameIsWon: false
        }

    }

    makeInitialBoardSquareInfo(boardSize, minePercentage) {
        //create and initialize squareInfoForThisGame as an array with object elements
        let squareInfoForThisGame = [] //each element will be a tempInnerArray (so this is an array of arrays)
        for (let i = 0; i < Math.sqrt(boardSize); i++) {//step through each column
            let tempInnerArray = [] // this will be hold the object form of the elements
            for (let j = 0; j < Math.sqrt(boardSize); j++) {//step through each row (entry) in row
                let tempSquareInfoObj = {
                    mine: (Math.random() * 100 <= minePercentage),
                    number: 0,
                    revealed: false,
                }
                tempInnerArray.push(tempSquareInfoObj)
            }
            squareInfoForThisGame.push(tempInnerArray)
        }

        //then lets calculate the numbers for any cells that have squareInfoForThisGame.mine = false;
        for (let i = 0; i < squareInfoForThisGame.length; i++) {//step through each row
            for (let j = 0; j < squareInfoForThisGame.length; j++) {//step through each column (entry) in row
                if (!squareInfoForThisGame.mine) {
                    squareInfoForThisGame[i][j].number = this.calcNumberOfAdjacentMines(squareInfoForThisGame, i, j)
                }
            }
        }

        console.log("makeInitialBoardInfo called")
        console.log(squareInfoForThisGame)

        return (squareInfoForThisGame)

    }

    calcNumberOfAdjacentMines(squareInfoForThisGame, i, j) {
        //squareInfoForThisGame is an array with each element being object representing the details of a square
        // with form [ [{}] [{}] ... ]; and the objects have form {mine:boolean, number: integer, revealed:boolean}
        let counter = 0;

        //look up 1 square
        if (i + 1 < squareInfoForThisGame.length && squareInfoForThisGame[i + 1][j].mine) {
            counter++
        }
        //look down 1 square
        if (i - 1 >= 0 && squareInfoForThisGame[i - 1][j].mine) {
            counter++
        }
        //look right 1 square
        if (j + 1 < squareInfoForThisGame.length && squareInfoForThisGame[i][j + 1].mine) {
            counter++
        }
        //look left 1 square
        if (j - 1 >= 0 && squareInfoForThisGame[i][j - 1].mine) {
            counter++
        }
        //look up-right 1 square
        if (j + 1 < squareInfoForThisGame.length && i + 1 < squareInfoForThisGame.length &&
            squareInfoForThisGame[i + 1][j + 1].mine) {
            counter++
        }
        //look down-right 1 square
        if (j + 1 < squareInfoForThisGame.length && i - 1 >= 0 &&
            squareInfoForThisGame[i - 1][j + 1].mine) {
            counter++
        }
        //look up-left 1 square
        if (j - 1 >= 0 && i + 1 < squareInfoForThisGame.length &&
            squareInfoForThisGame[i + 1][j - 1].mine) {
            counter++
        }
        //look down-left 1 square
        if (j - 1 >= 0 && i - 1 >= 0 &&
            squareInfoForThisGame[i - 1][j - 1].mine) {
            counter++
        }

        return counter
    }

    handleClick(i, j) {

        //if the game is not over, handle the click
        if (!this.state.gameIsOver) {
            let tempStateArray = this.state.squareInfo.slice()
            //reveal the game square
            tempStateArray[i][j].revealed = true


            //if this is a mine, game over
            if (tempStateArray[i][j].mine) {
                this.setState({
                    gameIsOver: tempStateArray[i][j].mine
                })
                return //exit this function before updating anything else below
            }

            //if this cell is not a mine, nearby cells with numbers get reveled
            if (!tempStateArray[i][j].mine) {
                tempStateArray = this.revealNearbyCells(tempStateArray, i, j).slice()
                //.slice() so we aren't using same object that was returned
            }



            //update the squareInfo array the new board
            this.setState({
                squareInfo: tempStateArray,
                gameIsWon: this.checkIfWon(tempStateArray)
            })

        }
    }

    checkIfWon(stateArray){
        let tempStateArray = stateArray.slice()

        for(let i=0; i<tempStateArray.length; i++){
            for(let j=0; j<tempStateArray.length; j++){
                //only need to find a single cell that is not a mine that is not revealed to prove haven't won
                //as soon as all non-mine cells are found, game is won
                if(!tempStateArray[i][j].revealed && !tempStateArray[i][j].mine){
                    console.log("this cell isn't revealed: row:" + i +" column: "+ j)
                    return false
                }
            }
        }


        return true
    }

    revealNearbyCells(stateArray, i, j) {
        let tempArray = stateArray.slice()

        //look at the neighboring 8 cells and set them to revealed
        //each zero we find that isn't already revealed we call revealNearbyCells again, passing a new i,j
        if (tempArray[i][j].number == 0) {
            //look up 1 square
            if (i + 1 < tempArray.length && !tempArray[i + 1][j].mine) {
                if (tempArray[i + 1][j].number == 0 && !tempArray[i + 1][j].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i + 1][j].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i + 1, j)
                }
                tempArray[i + 1][j].revealed = true
                //console.log("looked up")
            }
            //look down 1 square
            if (i - 1 >= 0 && !tempArray[i - 1][j].mine) {
                if (tempArray[i - 1][j].number == 0 && !tempArray[i - 1][j].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i - 1][j].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i - 1, j)
                }
                tempArray[i - 1][j].revealed = true
                //console.log("looked down")
            }
            //look right 1 square
            if (j + 1 < tempArray.length && !tempArray[i][j + 1].mine) {
                if (tempArray[i][j + 1].number == 0 && !tempArray[i][j + 1].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i][j+1].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i, j + 1)
                }
                tempArray[i][j + 1].revealed = true
                //console.log("looked right")
            }
            //look left 1 square
            if (j - 1 >= 0 && !tempArray[i][j - 1].mine) {
                if (tempArray[i][j - 1].number == 0 && !tempArray[i][j - 1].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i][j - 1].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i, j - 1)
                }
                tempArray[i][j - 1].revealed = true
                //console.log("looked left")
            }
            //look up-right 1 square
            if (j + 1 < tempArray.length && i + 1 < tempArray.length &&
                !tempArray[i + 1][j + 1].mine) {
                if (tempArray[i + 1][j + 1].number == 0 && !tempArray[i + 1][j + 1].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i + 1][j + 1].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i + 1, j + 1)
                }
                tempArray[i + 1][j + 1].revealed = true
                //console.log("looked up-right")
            }
            //look down-right 1 square
            if (j + 1 < tempArray.length && i - 1 >= 0 &&
                !tempArray[i - 1][j + 1].mine) {
                if (tempArray[i - 1][j + 1].number == 0 && !tempArray[i - 1][j + 1].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i - 1][j + 1].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i - 1, j + 1)
                }
                tempArray[i - 1][j + 1].revealed = true
                //console.log("looked down-right")
            }
            //look up-left 1 square
            if (j - 1 >= 0 && i + 1 < tempArray.length &&
                !tempArray[i + 1][j - 1].mine) {
                if (tempArray[i + 1][j - 1].number == 0 && !tempArray[i + 1][j - 1].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i + 1][j - 1].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i + 1, j - 1)
                }
                tempArray[i + 1][j - 1].revealed = true
                //console.log("looked up-left")
            }
            //look down-left 1 square...re-name b/c this is up-left??
            if (j - 1 >= 0 && i - 1 >= 0 &&
                !tempArray[i - 1][j - 1].mine) {
                if (tempArray[i - 1][j - 1].number == 0 && !tempArray[i - 1][j - 1].revealed) {
                    // if the nearby square is not revealed, we'll keep revealing
                    tempArray[i - 1][j - 1].revealed = true
                    tempArray = this.revealNearbyCells(tempArray, i - 1, j - 1)
                }
                tempArray[i - 1][j - 1].revealed = true
                //console.log("looked down-left")
            }
        }

        return tempArray
    }

    //this function will create the buttons for the game board
    makeButtonsForBoard(boardSize) {
        let buttonArray = new Array(boardSize)
        for (let i = 0; i < buttonArray.length; i++) { //each entry in the array is annother array
            buttonArray[i] = new Array(buttonArray.length)
        }
        //first attempt here is to create a grid of buttons with 'X' on them
        for (let i = 0; i < boardSize; i++) {
            //i loops on rows
            for (let j = 0; j < boardSize; j++) {
                //j loops on columns
                buttonArray[i][j] = //without the arrow function, handleClick would need to return something
                    <button onClick={() => this.handleClick(i, j)}>{
                        (this.state.squareInfo[i][j].revealed && !this.state.squareInfo[i][j].mine) ?
                            this.state.squareInfo[i][j].number : "X"
                    }
                    </button>
            }
        }
        return (buttonArray)
    }

    //create a function that takes in an array, and returns <div> separated arrays
    //lets make buttons here instead
    renderBoard() {
        let board = this.makeButtonsForBoard(this.state.squareInfo.length) //2D array of button objects
        let returnArray = [] //each entry is a <div>buttonRow</div>

        //for loop to populate a returnArray with entries consisting of buttonRows.
        for (let i = 0; i < board.length; i++) {
            //inner loop populates buttonRow (one row from board is pulled out and added to buttonRow
            let buttonRow = []//each entry is a row of buttons from board
            for (let j = 0; j < board[i].length; j++) {
                buttonRow.push(board[i][j])
            }
            returnArray.push(<div>{buttonRow}</div>)
        }
        return (returnArray)
    }


    render() {

        return (//create a for loop to put each row of buttons in its own row on the screen
            <div>
                <div>
                    {this.renderBoard()}
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {this.state.gameIsOver ? "You Hit A Mine and Lost!! Game Over!":
                        this.state.gameIsWon?"Yahoo! You Avoided All Mines! Great Work!":
                            "Keep Playing!!"}
                </div>
            </div>
        )
    }
}

export default Gameboard