import React from "react";
import './styles.sass';

import truckFront from '../../assets/truck_front_green.svg';
import Event from '../Event';
import { epochSecondsToTime } from "../../util";

class EventsTruck extends React.Component {
  renderEvents() {
    // using a map instead of object because we want to preserve order, so that earlier
    // start times come first when iterating
    const eventsByTime = new Map();
    this.props.events
      .slice(0) // make a copy so we don't modify the original
      .sort((a, b) => a.startTime - b.startTime)
      .forEach(event => {
        if (eventsByTime.has(event.startTime)) {
          eventsByTime.get(event.startTime).push(event);
        } else {
          eventsByTime.set(event.startTime, [event]);
        }
      });

    return Array.from(eventsByTime.entries()).map(([epochTime, events]) => {
      const { time, ampm } = epochSecondsToTime(epochTime);
      return (
        <div className="events-at-time" key={epochTime}>
          <div className="time">{time}<span className="small">{ampm}</span></div>
          <div className="events">
            <div>{events.map(event => <Event event={event} key={event.name}/>)}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="events-truck">
        {/* <object className="truck-front" data={truckFront} aria-label="Truck Front"/> */}
        <img className="truck-front" src={truckFront} alt="Truck Front"/>

        <div className="connector"/>

        <div className="events-container">
          { this.renderEvents() }
        </div>
      </div>
    );
  }
}

export default EventsTruck;