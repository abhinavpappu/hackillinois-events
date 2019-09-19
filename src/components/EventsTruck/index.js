import React from "react";
import styles from './styles.module.sass';

import truckFrontGreen from '../../assets/truck_front_green.svg';
import truckFrontRed from '../../assets/truck_front_red.svg'
import Event from '../Event';
import { epochSecondsToTime } from "../../util";

class EventsTruck extends React.Component {
  constructor(props) {
    super(props);
    this.truckRef = React.createRef();
    this.state = {
      height: 0,
    }
  }

  componentDidUpdate() {
    const height = this.truckRef.current.offsetHeight;
    if (this.props.onHeightChange && height !== this.state.height) {
      this.setState({ height }, () => this.props.onHeightChange(height));
    }
  }

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
      const { showPopup, starEvent } = this.props;
      return (
        <div className={styles['events-at-time']} key={epochTime}>
          <div className={styles.time}>{time}<span className={styles.small}>{ampm}</span></div>
          <div className={styles.events}>
            {events.map(event => 
              <Event
                event={event}
                key={event.name}
                showPopup={event => showPopup(event)}
                starEvent={eventName => starEvent(eventName)}
              />
            )}
          </div>
        </div>
      );
    });
  }

  render() {
    const truckFront = this.props.green ? truckFrontGreen : truckFrontRed;
    const truckStyle = { transform: `translate(10px, ${this.props.translateY}px)` };
    const eventsContainerStyle = { }
    const truckFrontStyle = { }
    if (this.props.flip) {
      truckStyle.transform = `translate(-10px, ${this.props.translateY}px) rotate(180deg)`;
      eventsContainerStyle.transform = ' rotate(180deg)'; // rotate events-container again since we want events right side up

      // need to flip the direction of the shadow since it's rotated 180deg
      // (don't need to flip events-container because it's rotated twice)
      truckFrontStyle.boxShadow = "-110px -4px 4px rgba(0, 0, 0, 0.25)"
    }

    const date = new Date((this.props.events[0] || {}).startTime * 1000)
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });

    return (
      <div className={styles['events-truck']} style={truckStyle} ref={this.truckRef}>
        <img className={styles['truck-front']} src={truckFront} style={truckFrontStyle} alt="Truck Front"/>

        <div className={styles.connector}/>

        <div className={styles['events-container']} style={eventsContainerStyle}>
          <div className={styles['day-of-week']}>{dayOfWeek}</div>
          { this.renderEvents() }
        </div>
      </div>
    );
  }
}

export default EventsTruck;