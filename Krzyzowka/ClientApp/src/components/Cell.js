import React, { Component } from 'react';

export default class Cell extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            editing: false,
            inputVal: "",
            solved: false,
            value: "",
            wordSolved: false
        };

        this.cellRef = React.createRef();
    }

    componentDidUpdate() {
        if (this.state.value !== "") {
        }
    }

    componentDidMount() {
        if (typeof this.props.addToRefs === "function") {
            this.props.addToRefs(this.cellRef);
        }
    }

    handleFocus = () => {
        this.setState({ editing: !this.state.editing });
        this.props.changeActiveCell({
            index: this.props.index,
            wordNum: this.props.wordNum
        });
    };

    handleBlur = () => {
        this.setState({ editing: !this.state.editing });
        if (this.props.value === "") {
            this.setState(
                { value: this.props.value, solved: false }
                // this.props.onWordUnfocus()
            );
        }
    };

    handleChange = (e) => {
        let { index, wordNum } = this.props;
        let value = e.target.value;

        if (value !== "") {
            this.setState(
                {
                    solved: true,
                    value: value
                },
                this.props.onWordChange({ value, index, wordNum })
            );
        }
    };

    render() {
        //(status = age >= 18 ? 'adult' : 'minor';)
        const style = this.state.editing
            ? "rgb(255,255,153)" //żółty
            : this.props.value === ""
            ? "rgb(10, 10, 10)" //czarny
            : this.props.editing
            ? "rgb(255,255,153)"  //żółty
            : "rgb(200, 200, 200)"; //szary

        const wordEditing = this.props.wordEditing
            ? "rgb(255,255,153)"
            : "rgb(10, 10, 10)";
        //skomplikowane wyliczenia zeby komorki ladnie sie wyswietlaly
        const x =
            this.props.x === 1
                ? this.props.x
                : this.props.x + 10 * (this.props.x - 1); 

        const y =
            this.props.y === 1
                ? this.props.y
                : this.props.y + 10 * (this.props.y - 1);

        //input w komorkach
        const input = (
            <foreignObject
                x={x}
                y={y}
                width="9"
                height="9"
                className={this.state.editing ? "input_current" : "input"}
            >  
                <div >
                    <input 
                        type="text"
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        value={this.state.inputVal}
                        className={this.state.editing ? "input_current" : "input"}
                        maxLength="1"
                        ref={this.cellRef}
                    />
                </div>
            </foreignObject>
        );

        return (
            <svg className="cell">
                <g>
                    <rect
                        x={x}
                        y={y}
                        width={10}
                        height={10}
                        style={{
                            fill: this.props.wordEditing ? wordEditing : style,
                            strokeWidth: "0.4px",
                            stroke: "black"
                        }}
                    />
                    <text x={x + 0.5} y={y + 2.7} className="small">
                        {this.props.number}
                    </text>
                    <text
                        x={x + 5}
                        y={y + 5.5}
                        className="heavy"
                        dominantBaseline="middle"
                        textAnchor="middle"
                        
                    >
                        {this.state.value} 
                    </text>
                </g>
                {this.props.value === "" ? null : input}
            </svg>
        );
    }
}