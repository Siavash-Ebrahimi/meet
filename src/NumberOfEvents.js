import React, { Component } from 'react';
import { ErrorAlert } from './Alert';

export default class NumberOfEvents extends Component {
  state = {
    num: 32,
    errorText: ''
  };

  handleInputChanged = (event) => {
    let inputValue = event.target.value;
    if (inputValue >= 33 || inputValue <= 0) {
      this.setState({
        num: inputValue,
        errorText: 'Please enter a number between 1 - 32.',
      });
    } else {
      this.setState({
        num: event.target.value,
        errorText: ' ',
      });
    }

    this.props.updateEvents(undefined, inputValue);
  };

  componentDidMount() {
    this.setState({ num: this.props.num || 32 });
  }

  render() {
    const { num } = this.state;

    return (
      <div className="numberOfEvents">
        <label for="number-of-events">Number of Events: </label>
        <input
          className='num'
          type='number'
          id="number-of-events"
          min="1"
          value={num}
          onChange={this.handleInputChanged}
        >
        </input>
        <div>
          <ErrorAlert className='redAlert' text={this.state.errorText} />
        </div>
      </div >
    );
  }
}