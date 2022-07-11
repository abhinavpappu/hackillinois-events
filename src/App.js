import React from 'react';
import styles from './App.module.sass';

import EventsTruck from './components/EventsTruck';
import EventPopup from './components/EventPopup';
import NotificationLights from './components/NotificationLights';

import {events} from './events-2020.json';

function getEvents() {
  // return (
  //   fetch('https://api.hackillinois.org/event/', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     }
  //   })
  //   .then(response => response.json())
  //   .then(json => json.events)
  // );
  return Promise.resolve(events);
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
    event.starred = starredEvents.includes(event.id);
  });
}

function saveStarredEvents(events) {
  localStorage.starredEvents = JSON.stringify(events
    .filter(event => event.starred)
    .map(event => event.id)
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventsByDay: [[], [], []], // [day1, day2, day3]
      animationControl: 0, // goes from 0 to 1, the two trucks' translateY are based on this value
      truckHeights: [0, 0, 0], // used for animations (will be updated using the onHeightChange callback prop on EventTruck)
      popupEvent: null,
    }
  }

  componentDidMount() {
    // Get the events from the api and update state
    getEvents().then(events => {
      starEvents(events);

      const [day1, day2, day3] = splitEventsIntoDays(events).map(arr => arr || []);

      this.setState({ eventsByDay: [day1, day2, day3] }, () => {
        // animate the trucks moving onto the page after the events load
        setTimeout(() => this.animateTrucks(), 500);
      });
    });
  }

  animateTrucks() {
    this.setState({ animationControl: 1 });
  }

  // this method stars/unstars an event depending on the previous value
  starEvent(eventId, dayIndex) {
    this.setState(state => {
      const eventsByDay = state.eventsByDay.slice(0); // make copy
      eventsByDay[dayIndex] = eventsByDay[dayIndex].map(event => {
        if (event.id === eventId) {
          return Object.assign({}, event, {starred: !event.starred});
        }
        return event;
      });
      return { eventsByDay }; 
    }, () => {
      saveStarredEvents(this.getAllEvents());
    });
  }

  getAllEvents() {
    const { eventsByDay } = this.state;
    return eventsByDay.reduce((allEvents, events) => allEvents.concat(events), []);
  }

  setTruckHeight(truckIndex, height) {
    this.setState(state => {
      const truckHeights = state.truckHeights.slice(0); // make copy
      truckHeights[truckIndex] = height;
      return { truckHeights };
    });
  }

  render() {
    const { eventsByDay, truckHeights, animationControl } = this.state;

    // The following positions the first and third truck 25px from the bottom, and the second truck 25px from the top after animation
    const truckTranslates = [
      -window.innerHeight + (2 * window.innerHeight - truckHeights[0] - 25) * animationControl,
      window.innerHeight - (window.innerHeight - 25) * animationControl,
      -window.innerHeight + (2 * window.innerHeight - truckHeights[2] - 25) * animationControl,
    ];

    return (
      <div className={styles.App}>
        {this.state.popupEvent && (
          <EventPopup event={this.state.popupEvent} hidePopup={() => this.setState({ popupEvent: null})} />
        )}

        <NotificationLights events={this.getAllEvents()} />

        <div className={styles.grass}/>
        <div className={styles.road}>
          <div className={styles.lane}>
            <div className={styles.text}>Hack</div>
            <EventsTruck
              events={eventsByDay[0]}
              translateY={truckTranslates[0]}
              flip
              height={truckHeights[0]}
              onHeightChange={height => this.setTruckHeight(0, height)}
              showPopup={event => this.setState({ popupEvent: event })}
              starEvent={id => this.starEvent(id, 0)}
            />
          </div>

          <div className={styles.separator}></div>

          <div className={styles.lane}>
            <div className={styles.text + ' '}><span className={styles.color}>Illinois</span></div>
            <EventsTruck
              events={eventsByDay[1]}
              translateY={truckTranslates[1]}
              height={truckHeights[1]}
              onHeightChange={height => this.setTruckHeight(1, height)}
              showPopup={event => this.setState({ popupEvent: event })}
              starEvent={id => this.starEvent(id, 1)}
              green={true}
            />
          </div>

          <div className={styles.separator}></div>

          <div className={styles.lane}>
            <div className={styles.text}>Events</div>
            <EventsTruck
              events={eventsByDay[2]}
              translateY={truckTranslates[2]}
              flip
              height={truckHeights[2]}
              onHeightChange={height => this.setTruckHeight(2, height)}
              showPopup={event => this.setState({ popupEvent: event })}
              starEvent={id => this.starEvent(id, 2)}
            />
          </div>
        </div>

        <div className={styles.grass}/>
      </div>
    );
  }
}


export default App;
