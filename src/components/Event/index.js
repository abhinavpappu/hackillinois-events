import React from 'react';
import styles from './styles.module.sass';

import { epochSecondsToTime } from '../../util';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as faStarFilled } from '@fortawesome/free-solid-svg-icons';

function Event({ event, showPopup, starEvent}) {
  const end = epochSecondsToTime(event.endTime);
  const starIcon = event.starred ? faStarFilled : faStar;
  return (
    <div>
      <div className={styles.event} onClick={() => showPopup(event)}>
        <div className={styles.title}>
          <div className={styles.name}>{event.name}</div>
          <div className={styles.spacer}/>
          <FontAwesomeIcon
            className={styles.icon}
            icon={starIcon}
            onClick={e => {starEvent(event.name); e.stopPropagation()}}
          />  
        </div>

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