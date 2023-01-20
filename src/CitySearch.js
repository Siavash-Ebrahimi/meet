import React, { Component } from 'react';

import { InfoAlert } from './Alert';

export default class CitySearch extends Component {
  constructor() {
    super();

    this.state = {
      query: '',
      suggestions: [],
      showSuggestions: undefined,
      infoText: ''
    }
  }

  handleInputChanged = (event) => {
    const value = event.target.value;
    this.setState({ showSuggestions: true });
    const suggestions = this.props.locations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    });
    if (suggestions.length === 0) {
      this.setState({
        query: value,
        infoText: 'We can not find the city you are looking for. Please try another city',
      });
    } else {
      return this.setState({
        query: value,
        suggestions,
        infoText: ''
      });
    }
  };

  handleItemClicked = (suggestion) => {
    this.setState({
      query: suggestion,
      suggestions: [],
      showSuggestions: false,
      infoText: "",
    });
    this.props.updateEvents(suggestion);
  };

  render() {
    return (
      <div className="CitySearch">

        <InfoAlert text={this.state.infoText} />

        <label for="city">Choose your nearest city:</label>
        <input
          type="text"
          id="city"
          className="city"
          placeholder='Search City'
          value={this.state.query}
          onChange={this.handleInputChanged}
          onFocus={() => { this.setState({ showSuggestions: true }) }}
        />

        <ul className="suggestions" style={(this.state.showSuggestions && this.state.suggestions.length !== 0) ? {} : { display: 'none' }}>
          {this.state.suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => this.handleItemClicked(suggestion)}
            >{suggestion}</li>
          ))}
          <li onClick={() => this.handleItemClicked("all")}>
            <b>See all cities</b>
          </li>
        </ul>
      </div>
    );
  }
}