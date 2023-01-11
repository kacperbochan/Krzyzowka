import React, { Component } from "react";
import Word from "./Word";
import Cell from "./Cell";

//use content loader
export default class Grid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: [],
            solvedWords: [],
            words: [],
            wordsLoaded: true,
            currentWord: null
        };
    }

    componentDidUpdate() {
        if (
            this.state.wordsLoaded &&
            this.props.data.numberOfWords === this.props.data.wordList.length
        ) {
            const words = this.props.data.wordList.map((word, index) => (
                <Word
                    number={index}
                    word={word.word}
                    x={word.x}
                    y={word.y}
                    orientation={word.orientation}
                    key={Math.random()}
                    onClick={this.handleWordClick}
                    wordChange={this.handleWordChange}
                />
            ));

            this.setState(
                { wordsLoaded: false, words: words },
                console.log(words)
            );
        }
    }

    componentDidMount() {
        let width = this.props.data.width; //ile komorek na wysokosc
        let height = this.props.data.height;
        let newGrid = [];

        for (let i = 1; i < width; i++) {
            for (let j = 1; j < height; j++) {
                newGrid.push( //tworzymy komórki
                    <Cell x={i} y={j} value={""} key={Math.random()} />
                );
            }
        }
        this.setState({ grid: newGrid }); //tu ustalam cały grid komórek
    }



    classNames = (props) =>
        Object.keys(props)
            .filter((f) => props[f] === true)
            .join(" ");

    
            
    handleWordChange = (word) => {
        this.setState(
            { solvedWords: this.state.solvedWords.concat(word) },
            () => {
                console.log(word);
                this.props.addSolvedWord(this.state.solvedWords);
            }
        );
    };

    render() {
        // to wielkosc calej planszy w sensie jak duza jest wyswietlana
        const dim =" 0 0 " + (10 * this.props.data.width + 3) + " " + (10 * this.props.data.height + 3); 
        // to tworzymy komórki na uzupelnianie hasla
        return (
            <div>
                <svg
                    viewBox={dim}
                    xmlns="http://www.w3.org/2000/svg"
                    className={this.classNames({
                        crossword__grid: true
                        // "crossword__grid--focussed": !! props.focussedCell
                        // How did props get here?
                    })}
                >
                    {this.state.grid}
                    {this.state.words}
                </svg>
            </div>
        );
    }
}