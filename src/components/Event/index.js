import React from 'react';
import './styles.sass';
import { epochSecondsToTime } from '../../util';


function Event(props) {
  const { event } = props;
  const end = epochSecondsToTime(props.event.endTime);
  return (
    <div className="event">
      <div className="name">{event.name}</div>
      <div className="details">
        <div className="location">
          {event.locations.map(location => location.description).join(' & ')}
        </div>

        <div className="spacer"/>
        
        <div className="end-time">{end.time}<span className="small">{end.ampm}</span></div>
      </div>
    </div>
  );
}


export default Event