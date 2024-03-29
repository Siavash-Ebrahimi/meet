// src/__tests__/App.test.js

import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import EventList from '../EventList';
import CitySearch from '../CitySearch';
import NumberOfEvents from '../NumberOfEvents';
import { mockData } from '../mock-data';
import { extractLocations, getEvents } from '../api';

describe('<App /> Unite Test: Just component', () => {
  let AppWrapper;
  beforeAll(() => {
    AppWrapper = shallow(<App />);
  });

  test('render list of events', () => {
    expect(AppWrapper.find(EventList)).toHaveLength(1);
  });

  test('render CitySearch', () => {
    expect(AppWrapper.find(CitySearch)).toHaveLength(1);
  });

  test("render NumberOfEvents", () => {
    expect(AppWrapper.find(NumberOfEvents)).toHaveLength(1);
  });
});

describe('<App /> Integration test App component and all its dependencies', () => {

  test('Integration test: App passes "events" state as a prop to EventList', () => {
    const AppWrapper = mount(<App />); // 1) Render the App componenet with all its depenedncies and save it in AppWrapper variable.    
    const AppEventsState = AppWrapper.state('events'); // 2) After render App we check dose it has any state of 'events' name or note and save it in another variable.
    expect(AppEventsState).not.toEqual(undefined);
    expect(AppWrapper.find(EventList).props().events).toEqual(AppEventsState);
    AppWrapper.unmount();
  });

  test('Integration test: App passes "locations" state as a prop to CitySearch', () => {
    const AppWrapper = mount(<App />);
    const AppLocationsState = AppWrapper.state('locations');
    expect(AppLocationsState).not.toEqual(undefined);
    expect(AppWrapper.find(CitySearch).props().locations).toEqual(AppLocationsState);
    AppWrapper.unmount();
  });

  test('Integration test: Get list of events matching the city selected by the user', async () => {
    const AppWrapper = mount(<App />);
    const CitySearchWrapper = AppWrapper.find(CitySearch);
    const locations = extractLocations(mockData);
    CitySearchWrapper.setState({ suggestions: locations });
    const suggestions = CitySearchWrapper.state('suggestions');
    const selectedIndex = Math.floor(Math.random() * (suggestions.length));
    const selectedCity = suggestions[selectedIndex];
    await CitySearchWrapper.instance().handleItemClicked(selectedCity);// awaiti use as async as maybe the list take time to upload.  
    const allEvents = await getEvents();
    const eventsToShow = allEvents.filter(event => event.location === selectedCity);
    expect(AppWrapper.state('events')).toEqual(eventsToShow);
    AppWrapper.unmount();
  });

  test('Integration test: Get list of all events when user selects "See all cities"', async () => {
    const AppWrapper = mount(<App />);
    const suggestionItems = AppWrapper.find(CitySearch).find('.suggestions li');
    await suggestionItems.at(suggestionItems.length - 1).simulate('click');
    const allEvents = await getEvents();
    expect(AppWrapper.state('events')).toEqual(allEvents);
    AppWrapper.unmount();
  });

  test('App passes "eventCount" state as a prop to NumberOfEvents', () => {
    const AppWrapper = mount(<App />);
    const AppEventCountState = AppWrapper.state('eventCount');
    expect(AppEventCountState).not.toEqual(undefined);
    expect(AppWrapper.find(NumberOfEvents).state('eventCount')).toBe(AppEventCountState);
    AppWrapper.unmount();
  });

  test('Change the "eventCount state when the input no. changes"', async () => {
    const AppWrapper = mount(<App />);
    const NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
    const inputField = NumberOfEventsWrapper.find('input.number');
    const eventObject = { target: { value: 20 } };
    inputField.simulate('change', eventObject);
    await getEvents();
    expect(AppWrapper.state('eventCount')).toBe(20);
    expect(NumberOfEventsWrapper.state('eventCount')).toBe(20);
    AppWrapper.unmount();
  });

  test('The number of events rendered matching the input number', async () => {
    const AppWrapper = mount(<App />);
    const NumberOfEventsWrapper = AppWrapper.find(NumberOfEvents);
    const EventListWrapper = AppWrapper.find(EventList);
    const eventObject = { target: { value: 1 } };
    await NumberOfEventsWrapper.instance().handleInputChanged(eventObject);
    await getEvents();
    expect(AppWrapper.state('events')).toHaveLength(1);
    AppWrapper.unmount();
  });

});