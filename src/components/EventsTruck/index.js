import React from "react";
import styles from './styles.module.sass';

import truckFrontGreen from '../../assets/truck_front_green.svg';
import truckFrontRed from '../../assets/truck_front_red.svg'
import Event from '../Event';

class EventsTruck extends React.Component {
  constructor(props) {
    super(props);
    this.truckRef = React.createRef();
  }

  componentDidUpdate() {
    const height = this.truckRef.current.offsetHeight;
    if (this.props.onHeightChange && height !== this.props.height) {
      this.props.onHeightChange(height);
    }
  }

  renderEvents() {
    const { events, showPopup, starEvent } = this.props;

    return events
      .slice(0) // make a copy so we don't modify the original
      .sort((a, b) => a.startTime - b.startTime)
      .map(event => (
        <Event
          event={event}
          key={event.name}
          showPopup={showPopup}
          starEvent={starEvent}
        />
      ))
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
          
          <div className={styles.events}>
            { this.renderEvents() }
          </div>
        </div>
      </div>
    );
  }
}

export default EventsTruck;