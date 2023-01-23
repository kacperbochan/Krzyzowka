import React, { Component } from "react";
import Cell from "./Cell";

export default class Word extends Component {
    constructor(props) {
        super(props);
        this.state = {
            length: this.props.length,
            solved: [],
            tuples: [],
            indices: [],
            cells: [],
            currentWord: null
        };
    }


    componentDidMount() {
        let cells = [];

        for (let index = 0; index < this.props.length; index++){
            cells.push(
                <React.Fragment key={this.props.firstCharacter + index}>
                    <Cell
                        currentWord={this.props.currentWord}
                        value={this.state.value}
                        value={this.state.value}
                        index={index}
                        number={index === 0 ? this.props.number + 1 : null}
                        wordNum={this.props.number}
                        x={
                            this.props.orientation === "horizontal"
                                ? this.props.x + index
                                : this.props.x
                        }
                        y={
                            this.props.orientation === "vertical"
                                ? this.props.y + index
                                : this.props.y
                        }
                        onWordChange={this.handleWordChange}
                        addToRefs={this.props.addToRefs}
                        moveToNextCell={this.props.moveToNextCell}
                        moveToNextWord={this.props.moveToNextWord}
                        changeActiveCell={this.props.changeActiveCell}
                    />
                </React.Fragment>
            );
        };

        this.setState({ cells: cells, currentWord: this.props.currentWord });
    }



    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            let cells = [];

            for (let index = 0; index < this.props.length; index++) {
                cells.push(
                    <React.Fragment key={this.props.firstCharacter + index}>
                        <Cell
                            currentWord={this.props.currentWord}
                            value={this.state.tuples}
                            index={index}
                            number={index === 0 ? this.props.number + 1 : null}
                            wordNum={this.props.number}
                            x={
                                this.props.orientation === "horizontal"
                                    ? this.props.x + index
                                    : this.props.x
                            }
                            y={
                                this.props.orientation === "vertical"
                                    ? this.props.y + index
                                    : this.props.y
                            }
                            onWordChange={this.handleWordChange}
                            addToRefs={this.props.addToRefs}
                            moveToNextCell={this.props.moveToNextCell}
                            moveToNextWord={this.props.moveToNextWord}
                            changeActiveCell={this.props.changeActiveCell}
                        />
                    </React.Fragment>
                );
            };

            this.setState({
                cells: cells,
                currentWord: this.props.currentWord
            });
        }

        const { solved, length } = this.state;

        if (this.state.solved.length === length) {
            this.props.wordChange(
                {
                    value: solved,
                    number: this.props.number,
                    currentWord: this.props.currentWord
                }
            );
        }
    }


    addToRefs = (ref) => {
        //called by Cell cDm
        this.props.addToRefs(ref);
    };


    handleWordChange = (tuple) => {
        //called by Cell handleChange
        console.log("word handleWordChange", tuple);
        let { tuples, indices, solved } = this.state;

        if (this.state.indices.indexOf(tuple.index) === -1) {
            //if incoming indice is empty
            this.setState(
                {
                    tuples: [...tuples, tuple],
                    indices: [...indices, tuple.index]
                },
                this.setState({
                    solved: [...solved, tuple]
                })
            );
        } else {
            let edit = tuples.findIndex((x) => x.index === tuple.index);

            tuples[edit].value = tuple.value;
            solved[edit] = tuple;
            this.setState(
                { tuples: tuples, solved: solved },
                console.log("index edited", tuples[edit])
            );
        }
        this.props.moveToNextCell();
    };


    render() {
        return this.state.cells;
    }
}