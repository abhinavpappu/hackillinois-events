import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import styles from './styles.module.sass';
import { epochSecondsToTime } from '../../util';

const formatDate = seconds => (
  new Date(seconds * 1000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
);

function EventPopup({ event, hidePopup }) {
  const start = epochSecondsToTime(event.startTime);
  const end = epochSecondsToTime(event.endTime);
  // only taking the first location for now since the google maps embed thing that doesn't need a
  // GCP api key only supports marking one location
  const { latitude, longitude } = event.locations[0];
  const googleMapsSrc = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&&output=embed`;
  return (
    <div className={styles['event-popup']} onClick={() => hidePopup()}> {/* hide popup when there is click anywhere on the darkening background */}
      <div className={styles.content} onClick={e => e.stopPropagation()}> {/* don't hide popup when the content is clicked on */}
        <div className={styles.date}>{formatDate(event.startTime)}</div>

        <div className={styles.name}>{event.name}</div>

        <div className={styles.time}>
          <FontAwesomeIcon className={styles.icon} icon={faClock} fixedWidth />&nbsp;
          { start.time }<span className={styles.small}>{ start.ampm }</span>
          &nbsp; – &nbsp;
          { end.time }<span className={styles.small}>{ end.ampm }</span>
        </div>

        <div className={styles.location}>
          <FontAwesomeIcon className={styles.icon} icon={faMapMarkerAlt} fixedWidth />
          &nbsp;{ event.locations.map(location => location.description).join(' & ') }
        </div>

        <iframe 
          title="Location in Google Maps"
          width="350" 
          height="170" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight="0" 
          marginWidth="0" 
          src={googleMapsSrc}
        />

        <div className={styles.description}>{event.description}</div>

      </div>
    </div>
  );
}

export default EventPopup;