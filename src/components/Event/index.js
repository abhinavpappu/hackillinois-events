import React from 'react';
import styles from './styles.module.sass';

import { epochSecondsToTime } from '../../util';

function Event({ event, showPopup}) {
  const end = epochSecondsToTime(event.endTime);
  return (
    <div>
      <div className={styles.event} onClick={() => showPopup(event)}>
        <div className={styles.name}>{event.name}</div>
        <div className={styles.details}>
          <div className={styles.location}>
            {event.locations.map(location => location.description).join(' & ')}
          </div>

          <div className={styles.spacer}/>

          <div className={styles['end-time']}>{end.time}<span className={styles.small}>{end.ampm}</span></div>
        </div>
      </div>
    </div>
  );
}

export default Event