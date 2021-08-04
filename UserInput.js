import React from 'react'

//let's allow the user to choose a game board size (small, medium, large) and a difficulty (easy, moderate, difficult)
//let's also add a 'restart game' button

class UserInput extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {

        return (
            <div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>Hello! And Welcome to Rubin's Minesweeper-like Game!
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>Choose a Difficulty Setting
                </div>
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <button onClick={() => this.props.callBackFunction("Easy")}>Easy</button>
                    <button onClick={() => this.props.callBackFunction("Moderate")}>Moderate</button>
                    <button onClick={() => this.props.callBackFunction("Difficult")}>Difficult</button>
                </div>
            </div>
        )
    }

}

export default UserInput