import React from 'react';
import styles from './App.module.sass';

import EventsTruck from './components/EventsTruck';
import EventPopup from './components/EventPopup';
import NotificationLights from './components/NotificationLights';

function getEvents() {
  return (
    fetch('https://sad-hamilton-0c5a80.netlify.com/event/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    .then(response => response.json())
    .then(json => json.events)
  );
}

function splitEventsIntoDays(events) {
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

  return Array.from(eventsByDate.values());
}

// Check if any events were starred by the user (probably in a previous session), which is stored in localStorage
// and star the given events appropriately
function starEvents(events) {
  const starredEvents = JSON.parse(localStorage.starredEvents || "[]");
  events.forEach(event => {
    event.starred = starredEvents.includes(event.name);
  });
}

function saveStarredEvents(events) {
  localStorage.starredEvents = JSON.stringify(events
    .filter(event => event.starred)
    .map(event => event.name)
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstDayEvents: [],
      secondDayEvents: [],
      animationControl: 0, // goes from 0 to 1, the two trucks' translateY are based on this value
      truckHeight: 0, // used for animations (will be updated using the onHeightChange callback prop on EventTruck)
      truck2Height: 0,
      popupEvent: null,
    }
  }

  componentDidMount() {
    // Get the events from the api and update state
    getEvents().then(events => {
      starEvents(events);

      // We assume there are only two days for now (will expand road to 3 lanes later)
      const [day1, day2] = splitEventsIntoDays(events)

      this.setState({
        firstDayEvents: day1 || [],
        secondDayEvents: day2 || [],
      }, () => this.animateTrucks()); // animate the trucks moving onto the page after the events load
    })
  }

  animateTrucks() {
    this.setState({ animationControl: 1 });
  }

  // this method stars/unstars an event depending on the previous value
  starEvent(eventName, stateDayString) {
    this.setState(state => {
      const events = state[stateDayString].map(event => {
        if (event.name === eventName) {
          return Object.assign({}, event, {starred: !event.starred});
        }
        return event;
      });
      return { [stateDayString]: events }; 
    }, () => {
      saveStarredEvents(this.getAllEvents());
    });
  }

  getAllEvents() {
    return this.state.firstDayEvents.concat(this.state.secondDayEvents);
  }

  render() {
    // The following positions the first truck 25px from the bottom, and the second truck 25px from the top after animation
    const truckTranslateY = -window.innerHeight + (2 * window.innerHeight - this.state.truckHeight - 25) * this.state.animationControl;
    const truck2TranslateY = window.innerHeight - (window.innerHeight - 25) * this.state.animationControl;
    return (
      <div className={styles.App}>
        {this.state.popupEvent && <EventPopup event={this.state.popupEvent} hidePopup={() => this.setState({ popupEvent: null})}/>}

        <NotificationLights events={this.getAllEvents()} />

        <div className={styles.grass}/>
        <div className={styles.road}>
          <div className={styles.lane}>
            <EventsTruck
              events={this.state.firstDayEvents}
              translateY={truckTranslateY}
              flip
              onHeightChange={height => this.setState({ truckHeight: height })}
              showPopup={event => this.setState({ popupEvent: event })}
              starEvent={eventName => this.starEvent(eventName, 'firstDayEvents')}
            />
          </div>

          <div className={styles.separator}></div>

          <div className={styles.lane}>
            <EventsTruck
              events={this.state.secondDayEvents}
              translateY={truck2TranslateY}
              onHeightChange={height => this.setState({ truck2Height: height })}
              showPopup={event => this.setState({ popupEvent: event })}
              starEvent={eventName => this.starEvent(eventName, 'secondDayEvents')}
              green={true}
            />
          </div>
        </div>
        <div className={styles.grass}/>
      </div>
    );
  }
}


export default App;
