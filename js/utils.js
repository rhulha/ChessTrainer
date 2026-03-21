var move_sound_url = '../sounds/move.mp3';

export var move_sound = new Audio(move_sound_url);
move_sound.volume = 0.2;

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function log_obj(obj) {
  console.log(JSON.stringify(obj));
}
