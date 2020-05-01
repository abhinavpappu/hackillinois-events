import React from 'react';
import styles from './styles.module.sass';

import { epochSecondsToTime } from '../../util';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';

function Event({ event, showPopup, starEvent}) {
  const start = epochSecondsToTime(event.startTime);
  const end = epochSecondsToTime(event.endTime);
  const starIcon = event.starred ? faStarFilled : faStar;
  return (
    <div>
      <div className={styles.event} onClick={() => showPopup(event)}>
        <div className={styles.times}>
          {start.time}<span className={styles.ampm}>{start.ampm}</span>
          &nbsp;–&nbsp;
          {end.time}<span className={styles.ampm}>{end.ampm}</span>
        </div>

        <div className={styles.title}>
          <div className={styles.name}>{event.name}</div>
          <div className={styles.spacer}/>
          <FontAwesomeIcon
            className={styles.icon}
            icon={starIcon}
            onClick={e => {starEvent(event.id); e.stopPropagation()}}
          />  
        </div>

        <div className={styles.details}>
          <div className={styles.location}>
            {event.locations.map(location => location.description).join(' & ')}
          </div>

          <div className={styles.spacer}/>
        </div>
      </div>
    </div>
  );
}

export default Event