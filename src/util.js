export function epochSecondsToTime(epochSeconds) {
  const date = new Date(epochSeconds * 1000);
  const [time, ampm] = date.toLocaleTimeString().split(' ');
  return {
    time: time.slice(0, -3), // get rid of the seconds (00:00:00 -> 00:00)
    ampm,
  };
}