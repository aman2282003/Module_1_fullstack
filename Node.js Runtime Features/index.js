/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 */

const fs = require('fs');
const path = require('path');

// Absolute, OS-safe path to the sample file (do NOT hand-build paths with '+').
const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

// ── PART 1: read the whole file into memory, then log its size ──────────────
function readWholeFile() {
  fs.readFile(INPUT, (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    console.log(`readFile: loaded ${data.length} bytes into memory`);
  });
}

// ── PART 2: stream the file and pipe it to a writable stream ────────────────
function streamFile() {
  const readable = fs.createReadStream(INPUT);
  const writable = fs.createWriteStream(OUTPUT);

  readable.pipe(writable);

  readable.on('error', (err) => {
    console.error('Read stream error:', err);
  });

  writable.on('error', (err) => {
    console.error('Write stream error:', err);
  });

  writable.on('finish', () => {
    console.log(
      'stream: finished copying via chunks (flat memory usage)'
    );
  });
}

// ── PART 3: explain the difference ──────────────────────────────────────────
//
// YOUR EXPLANATION:
//
// The fs.readFile() method loads the entire file into memory before it can be
// processed. This is fine for small files, but large files can consume a lot
// of RAM and may slow down the application. Streams process the file in small
// chunks and transfer data piece by piece, so memory usage remains low and
// predictable regardless of the file size.

// Run both approaches.
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };