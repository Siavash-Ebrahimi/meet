import React, { Component } from 'react';

export default class NumberOfEvents extends Component {
  state = {
    num: 32,
    errorText: ''
  };

  changeNum = (value) => {
    this.setState({ num: value });
    this.props.updateEvents(value);
    if (value < 1 || value > 32) {
      this.setState({ errorText: "Select number from 1 to 32" });
    } else this.setState({ errorText: "" });
  };

  componentDidMount() {
    this.setState({ num: this.props.num || 32 });
  }

  render() {
    const { num } = this.state;

    return (
      <div className="NumberOfEvents">
        <label for="number-of-events">Number of Events: </label>
        <input
          className='num'
          type='number'
          id="number-of-events"
          min="1"
          value={num}
          onChange={(event) => {
            this.changeNum(event.target.value);
          }}
        >
        </input>
      </div >
    );
  }
}