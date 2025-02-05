export function formatTime(elapsedTime) {
  // const ms = elapsedTime % 1000;
  const seconds = Math.floor(elapsedTime / 1000) % 60;
  const minutes = Math.floor(elapsedTime / (1000 * 60)) % 60;
  const hours = Math.floor(elapsedTime / (1000 * 60 * 60));

  const format = (num, digits) => num.toString().padStart(digits, '0');
  return `${format(hours, 2)}:${format(minutes, 2)}:${format(seconds, 2)}`;
}