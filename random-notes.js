import { WebMidi, Note } from 'webmidi';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// specify intervals 135, specify length of sequence
// CONSTANTS
const ROOT = new Note('C4');
const AVAILABLE_SCALE_DEGREES = ['1', '3', '5'];
const LENGTH = 3;
const DURATION = 350;

const rl = createInterface({ input, output });
await WebMidi.enable();
const OUTPUT = WebMidi.outputs[0];
const INPUT = WebMidi.inputs[0];

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
const mapScaleDegreeToNote = (scaleDegree) =>
  new Note(ROOT.getOffsetNumber(undefined, SCALE_DEGREES.indexOf(scaleDegree)));

const playNotes = (notes) => {
  const time = WebMidi.time;
  for (let i = 0; i < notes.length; i++) {
    OUTPUT.playNote(notes[i], {
      duration: DURATION,
      time: time + DURATION * i,
      attack: 1,
    });
  }
};

// get random notes
const getRandomNotes = () => {
  let scaleDegreesToPlay = [];
  let notesToPlay = [];
  for (let i = 0; i < LENGTH; i++) {
    const randomScaleDegree = getRandom(AVAILABLE_SCALE_DEGREES);

    const note = mapScaleDegreeToNote(randomScaleDegree);

    scaleDegreesToPlay.push(randomScaleDegree);
    notesToPlay.push(note);
  }
  return { notesToPlay, scaleDegreesToPlay: scaleDegreesToPlay.join(' ') };
};

const displayMenu = async () => {
  const response = await rl.question(
    'Play again/New melody/Reveal solution (1,2,3)? ',
  );
  if (response === '1') {
    playNotes(musicToPlay.notesToPlay);
    displayMenuWhenMusicIsFinished();
  } else if (response === '2') {
    musicToPlay = getRandomNotes();
    playNotes(musicToPlay.notesToPlay);
    displayMenuWhenMusicIsFinished();
  } else if (response === '3') {
    console.log(musicToPlay.scaleDegreesToPlay);
    displayMenu();
  } else {
    process.exit(1);
  }
};
const displayMenuWhenMusicIsFinished = () => {
  setTimeout(async () => {
    displayMenu();
  }, LENGTH * DURATION);
};

// generate random notes => play notes => display menu of options when it's done
let musicToPlay = getRandomNotes();
playNotes(musicToPlay.notesToPlay);
displayMenuWhenMusicIsFinished();
