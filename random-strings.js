// input.mjs  (or set "type": "module" in package.json)
import { EdgeTTS } from 'node-edge-tts';
import os from 'node:os';
import path from 'node:path';
import { stdin as input, stdout as output } from 'node:process';
import readline from 'node:readline/promises';
import say from 'say';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const RESET_CODE = '\x1b[0m';
const boldenText = (str) => `\x1b[1m${str}${RESET_CODE}`;
const COLOR_CODES = [
  '\x1b[31m', // red
  '\x1b[32m', // green
  '\x1b[33m', // yellow
  '\x1b[34m', // blue
  '\x1b[35m', // magenta
  '\x1b[36m', // cyan
];
const rl = readline.createInterface({ input, output });

const NOTES = 'A B C D E F G A# C# D# F# G# Ab Bb Db Eb Gb';
const NOTES_NO_FLATS = 'A B C D E F G A# C# D# F# G#';
const INTERVALS = '1 b2 2 b3 3 4 #4 5 b6 6 b7 7';
const MAJOR_INTERVALS = '1 2 3 4 5 6 7';
const MINOR_INTERVALS = '1 2 b3 4 5 b6 b7';
const SHOULD_SPEAK = false;
const SPEAK_PAUSE_TIME_MS = 1500;
const COLS = 3;
const ROWS = 20;
const sets = [NOTES_NO_FLATS, MAJOR_INTERVALS].map((set) => set.split(' '));

// random from each
let prevRow = [];
let strsToSpeak = [];
for (let i = 0; i < ROWS; i++) {
  process.stdout.write(boldenText(`${i + 1}) `));
  process.stdout.write(COLOR_CODES[i % COLOR_CODES.length]);
  const row = [];
  for (let j = 0; j < COLS; j++) {
    const col = [];
    for (let setIndex = 0; setIndex < sets.length; setIndex++) {
      const currentSet = sets[setIndex];
      const index = Math.floor(Math.random() * currentSet.length);
      const selectedValue = currentSet[index];
      col.push(selectedValue);
    }
    row.push(col.join(' '));
  }

  process.stdout.write(row.join(', '));
  process.stdout.write(`${RESET_CODE}\n\n`);
}

rl.close();

if (SHOULD_SPEAK) {
  for (const s of strsToSpeak) {
    let finalStrToSay = s
      .replaceAll('A', 'ay')
      .replaceAll('#', ' sharp')
      .replaceAll('b', ' flat');
    say.speak(finalStrToSay, 'Microsoft Hazel Desktop', 1.0);
    await wait(SPEAK_PAUSE_TIME_MS);
  }
}
