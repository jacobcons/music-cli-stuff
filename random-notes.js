import { WebMidi, Note } from 'webmidi';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// specify intervals 135, specify length of sequence
// CONSTANTS
const ROOT_RANGE = ['D3', 'D4'];
const AVAILABLE_SCALE_DEGREES = ['1', '3', '5'];
const SCALE_DEGREE_OCTAVE_RANGE = 0;
const LENGTH = 3;
const DURATION = 350;
const DELAY = 1000;
const NOTE_VOLUME = 100;
const DRONE_VOLUME = 50;

let rootRange = ROOT_RANGE.map((note) => new Note(note).number);
const rl = createInterface({ input, output });
await WebMidi.enable();
const OUTPUT = WebMidi.outputs[0];
const MAIN = OUTPUT.channels[1];
const DRONE = OUTPUT.channels[2];
MAIN.sendControlChange('volumecoarse', NOTE_VOLUME);
DRONE.sendProgramChange(48);
DRONE.sendControlChange('volumecoarse', DRONE_VOLUME);

// helpers
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const SCALE_DEGREES = [
  '1',
  'b2',
  '2',
  'b3',
  '3',
  '4',
  '#4',
  '5',
  'b6',
  '6',
  'b7',
  '7',
];
const mapScaleDegreeToNote = (root, scaleDegree) => {
  const octaveOffset =
    Math.floor(Math.random() * 2 * SCALE_DEGREE_OCTAVE_RANGE) +
    SCALE_DEGREE_OCTAVE_RANGE;
  return new Note(
    root.getOffsetNumber(octaveOffset, SCALE_DEGREES.indexOf(scaleDegree)),
  );
};

const playNotes = (notes) => {
  const time = WebMidi.time;
  for (let i = 0; i < notes.length; i++) {
    MAIN.playNote(notes[i], {
      duration: DURATION,
      time: time + DURATION * i + DELAY,
    });
  }
};

// get random notes
const getRandomNotes = () => {
  let scaleDegreesToPlay = [];
  let notesToPlay = [];
  const [lowerRoot, upperRoot] = rootRange;
  const randomRoot = new Note(
    Math.floor(Math.random() * (upperRoot - lowerRoot)) + lowerRoot,
  );
  for (let i = 0; i < LENGTH; i++) {
    const randomScaleDegree = getRandom(AVAILABLE_SCALE_DEGREES);

    const note = mapScaleDegreeToNote(randomRoot, randomScaleDegree);

    scaleDegreesToPlay.push(randomScaleDegree);
    notesToPlay.push(note);
  }

  return {
    root: randomRoot,
    notesToPlay,
    scaleDegreesToPlay: scaleDegreesToPlay.join(' '),
  };
};

const displayMenu = async () => {
  const response = await rl.question(
    '1. Play again\n2. New melody\n3. Reveal solution\n',
  );
  if (response === '1') {
    playNotes(musicToPlay.notesToPlay);
    displayMenuWhenMusicIsFinished();
  } else if (response === '2') {
    stopDrone(musicToPlay.root);
    musicToPlay = getRandomNotes();
    startDrone(musicToPlay.root);
    playNotes(musicToPlay.notesToPlay);
    displayMenuWhenMusicIsFinished();
  } else if (response === '3') {
    console.log(`root: ${musicToPlay.root.identifier}`);
    console.log(`degrees: ${musicToPlay.scaleDegreesToPlay}`);
    displayMenu();
  } else {
    process.exit(1);
  }
};
const displayMenuWhenMusicIsFinished = () => {
  setTimeout(
    async () => {
      displayMenu();
    },
    LENGTH * DURATION + DELAY,
  );
};

const startDrone = (root) => {
  DRONE.playNote(root);
};

const stopDrone = (root) => {
  DRONE.stopNote(root);
};

// generate random notes => play notes => display menu of options when it's done
let musicToPlay = getRandomNotes();
startDrone(musicToPlay.root);
playNotes(musicToPlay.notesToPlay);
displayMenuWhenMusicIsFinished();
