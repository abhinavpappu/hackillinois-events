import React from 'react';
import './App.sass';

import EventsTruck from './components/EventsTruck';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstDayEvents: [],
      secondDayEvents: [],
    }
  }

  componentDidMount() {
    // Get the events from the api and update state
    fetch('https://sad-hamilton-0c5a80.netlify.com/event/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(json => {
      const { events } = json;

      // Convert the events into a map with keys of string date and a value of an events array
      // (e.g. "2/28/2020": [event, ...])
      // We also want the map entries to be in the order of the dates ("2/28/2020" comes before "3/1/2020")
      const eventsByDate = new Map(); // using Map instead of {} since order is important
      
      // sort events by startTime so that events on earlier days come first
      events.sort((a, b) => a.startTime - b.startTime);

      events.forEach(event => {
        const dateString = new Date(event.startTime * 1000).toLocaleDateString();
        if (eventsByDate.has(dateString)) {
          eventsByDate.get(dateString).push(event);
        } else {
          eventsByDate.set(dateString, [event]);
        }
      });

      const eventsByDateArray = Array.from(eventsByDate.values());

      this.setState({
        firstDayEvents: eventsByDateArray[0] || [],
        secondDayEvents: eventsByDateArray[1] || [],
      });
    })
  }

  render() {
    return (
      <div className="App">
        <div className="scene">
          <div className="grass"/>
          <div className="road">
            <div className="lane">

            </div>

            <div className="separator"></div>

            <div className="lane">
              <EventsTruck events={this.state.firstDayEvents}/>
            </div>
          </div>
          <div className="grass"/>
        </div>
      </div>
    );
  }
}


export default App;
