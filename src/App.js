import React, { Component } from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';
import NumberOfEvents from './NumberOfEvents';
import { getEvents, extractLocations, checkToken, getAccessToken } from './api';
import './nprogress.css';
import { OfflineAlert } from './Alert';
import WelcomeScreen from "./WelcomeScreen";
import EventGenre from './EventGenre';

// Recharts library components add for adding data analysis to our app.
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default class App extends Component {
  constructor() {
    super();

    this.state = {
      events: [],
      locations: [],
      seletedLocation: 'all',
      numberOfEvents: 32,
      showWelcomeScreen: undefined,
    }
  }

  updateEvents = (location, eventCount) => {
    const { numberOfEvents } = this.state;
    if (location === undefined) location = this.state.selectedLocation;
    getEvents().then((events) => {
      const locationEvents =
        location === 'all'
          ? events
          : events.filter((event) => event.location === location);
      eventCount = eventCount === undefined ? numberOfEvents : eventCount;
      this.setState({
        events: locationEvents.slice(0, eventCount),
        selectedLocation: location,
        numberOfEvents: eventCount,
      });
    });
  };

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter((event) => event.location === location).length
      const city = location.split(', ').shift()
      return { city, number };
    })
    return data;
  };

  async componentDidMount() {
    this.mounted = true;
    const isLocal =
      window.location.href.startsWith("http://127.0.0.1") ||
      window.location.href.startsWith("http://localhost");
    if (navigator.onLine && !isLocal) {
      const accessToken = localStorage.getItem("access_token");
      const isTokenValid = (await checkToken(accessToken)).error ? false : true;
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get("code");

      this.setState({ showWelcomeScreen: !(code || isTokenValid) });

      if ((code || isTokenValid) && this.mounted)
        getEvents().then((events) => {
          if (this.mounted) {
            this.setState({
              events: events.slice(0, this.state.numberOfEvents),
              locations: extractLocations(events),
            });
          }
        });
    } else {
      getEvents().then((events) => {
        if (this.mounted) {
          this.setState({
            showWelcomeScreen: false,
            events: events.slice(0, this.state.numberOfEvents),
            locations: extractLocations(events),
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { showWelcomeScreen } = this.state;
    if (showWelcomeScreen === undefined) {
      return <div className="App" />;
    } else if (showWelcomeScreen === true) {
      return (
        <WelcomeScreen showWelcomeScreen={showWelcomeScreen} getAccessToken={() => { getAccessToken(); }} />
      );
    } else {
      return <div className="App">
        <h1>Meet App ;)</h1>
        <div className="CitySearch">
          {!navigator.onLine && (
            <OfflineAlert text={'You are offline now. The list of events may not be up-to-date.'} />
          )}
        </div>
        <CitySearch locations={this.state.locations} updateEvents={this.updateEvents} />
        <NumberOfEvents num={this.state.numberOfEvents} updateEvents={this.updateEvents} />
        <div className='data-vis-wrapper'>
          <EventGenre events={this.state.events} />
          <ResponsiveContainer height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20, }}>
              <CartesianGrid />
              <XAxis type="category" dataKey="city" name="City" />
              <YAxis type="number" allowDecimals={false} dataKey="number" name="Number of Events" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {/* This new line gets its value of data from the new getData function you wrote 
                  above. Also, as you’re only displaying one set of data on this chart, you don’t 
                  need a name, so you can delete that property for now. */}
              <Scatter data={this.getData()} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        <EventList events={this.state.events} />
      </div>
    }
  }
}