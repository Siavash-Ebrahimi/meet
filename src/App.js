import React from 'react';
import './App.css';
import EventList from './EventList';
import CitySearch from './CitySearch';

export default function App() {
  return (
    <div className="App">
      <CitySearch />
      <EventList />
    </div>
  );
}