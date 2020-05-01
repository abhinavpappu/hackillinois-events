import React from 'react';

import styles from './styles.module.sass';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

class NotificationLights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: localStorage.notificationFrequency || 'none', // can be 'none', 'starred', or 'all'
      timeouts: [],
    }
  }

  componentWillReceiveProps() {
    this.resetTimeouts();
  }

  resetTimeouts() {
    this.state.timeouts.forEach(timeout => clearTimeout(timeout));
    this.setState({ timeouts: [] }, () => {
      if (this.state.selectedOption !== 'none' && Notification.permission === 'granted') {
        let { events } = this.props;
        if (this.state.selectedOption === 'starred') {
          events = events.filter(event => event.starred);
        }

        const timeouts = events.map(event => {
          // setTimeout for 10 minutes before the event
          const delay =  (event.startTime * 1000) - Date.now() - 10 * 60 * 1000;
          if (delay >= 0) { // make sure event hasn't already passed
            return setTimeout(() => new Notification(`${event.name} happening in 10 minutes!`), delay);
          }
          return 0;
        });

        this.setState({ timeouts });
      }
    });
  }

  selectOption(option) {
    if (option !== 'none') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          this.setState({ selectedOption: option }, () => this.resetTimeouts());
          localStorage.notificationFrequency = option;
        } else {
          this.setState({ selectedOption: 'none' }, () => this.resetTimeouts());
          localStorage.notificationFrequency = 'none';
          alert('Please allow us permission to show notifications in order to enable this option');
        }
      });
    } else {
      this.setState({ selectedOption: 'none' }, () => this.resetTimeouts());
      localStorage.notificationFrequency = 'none';
    }
  }

  render() {
    const redColor = this.state.selectedOption === 'none' ? '#f90606' : '#630303';
    const yellowColor = this.state.selectedOption === 'starred' ? '#fed401' : '#655501';
    const greenColor = this.state.selectedOption === 'all' ? '#3ec33c' : '#194e18';
    return (
      <div className={styles['notification-lights']}>
        <div className={styles.container}>
          <div className={styles.light} onClick={() => this.selectOption('none')}>
            <div className={styles.text}>Don't notify me</div>
            <FontAwesomeIcon icon={faBell} className={styles.icon} style={{ color: redColor }}/>
          </div>

          <div className={styles.light} onClick={() => this.selectOption('starred')}>
            <div className={styles.text}>Notify me for starred events</div>
            <FontAwesomeIcon icon={faBell} className={styles.icon} style={{ color: yellowColor }}/>
          </div>

          <div className={styles.light} onClick={() => this.selectOption('all')}>
            <div className={styles.text}>Notify me for all events</div>
            <FontAwesomeIcon icon={faBell} className={styles.icon} style={{ color: greenColor }}/>
          </div>
        </div>
      </div>
    )
  }
}

export default NotificationLights