import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Gameboard from './Gameboard'
import UserInput from './UserInput'


//here's an explanation of how minesweeper is played

//User is displayed a grid of buttons that represent the GAME BOARD
//Each square contains one of three items: a MINE, a NUMBER (see below), or is BLANK...let's set this as a state var?
//NUMBER: If a square is next to one or more mines, the square displays a number that indicates the number of
// adjacent squares that contain mines.  This includes by angles/corners


//Some Terms:
//FLAG: put a flag ina zone where you confirmed that there is a mine
//QUESTION MARK: put a question mark when you suspect that there is a mine
//SMILEY FACE: click it if you want to resent the game

//First step, the plan
//1) create a button, put it on the screen
//2) create a grid of buttons (later on we'll allow user to enter two items: number of mines and a difficulty/numMines)
//3) the game board needs to have a randomly generated set of mines/numbers/blanks;
//4) clicking a button changes the button to display the number of adjacent bombs (blanks-> number=0)
//5) after a button is clicked, the adjacent "number" buttons are all revealed
//6) the game is over when either a bomb is clicked or all non-bomb areas are displayed


class Minesweeper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gameDifficulty: null
        }
    }

    render() {

        return (
            <div>
                <div>
                    <UserInput
                        callBackFunction={(gameDifficulty) => {
                            this.setState({gameDifficulty: gameDifficulty})
                            console.log("this state is now: " + this.state.gameDifficulty)
                        }

                        }>

                    </UserInput>
                </div>
                <div style ={{
                    display:"flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {this.state.gameDifficulty != null ?
                        ("Difficulty Selected: " + this.state.gameDifficulty) :
                        ("Select Difficulty to Start")
                    }
                </div>
                <div style ={{
                    display:"flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    {
                        (this.state.gameDifficulty === "Easy" && <Gameboard boardSize={64} minePercentage={8}/>) ||
                        (this.state.gameDifficulty === "Moderate" && <Gameboard boardSize={64} minePercentage={16}/>) ||
                        (this.state.gameDifficulty === "Difficult" && <Gameboard boardSize={64} minePercentage={32}/>)

                    }
                </div>
            </div>
        )
    }


}

export default Minesweeper