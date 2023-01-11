import React, { Component } from 'react';
import isEmail, {sum} from './validation/Checks';

export class Crossword extends Component {
  static displayName = Crossword.name;

  constructor(props) {
    super(props);
    this.state = { currentCount: 0 , value: "a"};
    this.incrementCounter = this.incrementCounter.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  incrementCounter() {
    this.setState({
      currentCount: this.state.currentCount + 1
    });
  }

  handleChange(event) {
    this.setState({
      value: event.target.value
    });
  }

  render() {
    return (
      <div>
        <h1>Counter</h1>

        <p>This is a simple example of a React component.</p>

        <p aria-live="polite">Current count: <strong>{this.state.currentCount}</strong></p>
        
        <button className="btn btn-primary" onClick={this.incrementCounter}>Increment</button>

        <input type="text" id="message" name="message" value={this.state.value} onChange={this.handleChange} />

        <p aria-live="polite">Is text email: <strong>{isEmail(this.state.value)}</strong></p>

      </div>
    );
  }
}
