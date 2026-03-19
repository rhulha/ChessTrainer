var move_sound_url =
  'https://github.com/ornicar/lila/blob/master/public/sound/standard/Move.mp3?raw=true';

export var move_sound = new Audio(move_sound_url);
move_sound.volume = 0.2;

export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export function log_obj(obj) {
  console.log(JSON.stringify(obj));
}
