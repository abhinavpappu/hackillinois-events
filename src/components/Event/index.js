import React from 'react';
import styles from './styles.module.sass';

import { epochSecondsToTime } from '../../util';

import EventPopup from '../EventPopup';


class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
    };
  }
  showPopup() {
    this.setState({ showPopup: true });
  }

  hidePopup() {
    this.setState({ showPopup: false });
  }

  render() {
    const { event } = this.props;
    const end = epochSecondsToTime(event.endTime);
    return (
      <div>
        <div className={styles.event} onClick={() => this.showPopup()}>
          <div className={styles.name}>{event.name}</div>
          <div className={styles.details}>
            <div className={styles.location}>
              {event.locations.map(location => location.description).join(' & ')}
            </div>

            <div className={styles.spacer}/>

            <div className={styles['end-time']}>{end.time}<span className={styles.small}>{end.ampm}</span></div>
          </div>
        </div>

        <div style={{display: this.state.showPopup ? 'block' : 'none'}}>
          <EventPopup event={event} hidePopup={() => this.hidePopup()}/>
        </div>
      </div>
    );
  }
}


export default Event