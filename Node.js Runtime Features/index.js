/**
 * Node.js Runtime Features — Streams, Buffers & the File System
 * 
 * This module demonstrates two approaches to file handling:
 * 1. fs.readFile() - Load entire file into memory
 * 2. fs.createReadStream() - Process file in chunks using streams
 */

const fs = require('fs');
const path = require('path');

// Absolute, OS-safe path to the sample file (do NOT hand-build paths with '+').
const INPUT = path.join(__dirname, 'sample-data.txt');
const OUTPUT = path.join(__dirname, 'sample-copy.txt');

/**
 * ── PART 1: readWholeFile() ────────────────────────────────────────────────
 * 
 * Approach: Load the ENTIRE file into memory at once using fs.readFile()
 * 
 * Pros:
 *   - Simple and straightforward
 *   - Good for small files
 *   - Entire file is available immediately
 * 
 * Cons:
 *   - Loads entire file into memory (can be problematic for large files)
 *   - Higher memory consumption
 *   - Slower startup time for large files
 * 
 * Use case: Reading configuration files, small documents, or when you need
 *           the complete file content in memory
 */
function readWholeFile() {
  fs.readFile(INPUT, 'utf8', (err, data) => {
    if (err) {
      console.error('❌ Error reading file:', err.message);
      return;
    }

    const fileSizeKB = (data.length / 1024).toFixed(2);
    console.log(`✓ readFile: Loaded entire file into memory`);
    console.log(`  - File size: ${data.length} bytes (${fileSizeKB} KB)`);
    console.log(`  - Memory usage: Entire file in buffer\n`);
  });
}

/**
 * ── PART 2: streamFile() ───────────────────────────────────────────────────
 * 
 * Approach: Process file in CHUNKS using fs.createReadStream() with piping
 * 
 * Pros:
 *   - Constant, low memory usage regardless of file size
 *   - Better performance for large files
 *   - Processes data in manageable chunks (default 64KB)
 *   - Backpressure handling prevents memory overflow
 * 
 * Cons:
 *   - Slightly more complex setup
 *   - Data processed sequentially
 * 
 * Use case: Processing large files, video streaming, log file analysis,
 *           or any scenario where file size is unknown or very large
 * 
 * The pipe() method automatically handles:
 *   - Reading chunks from source
 *   - Writing chunks to destination
 *   - Backpressure (pausing when write buffer is full)
 */
function streamFile() {
  const readable = fs.createReadStream(INPUT, {
    encoding: 'utf8',
    highWaterMark: 64 * 1024  // 64KB chunks (default is 16KB)
  });
  
  const writable = fs.createWriteStream(OUTPUT);

  console.log(`✓ streamFile: Starting to stream file in chunks...`);
  
  let totalBytesRead = 0;
  let chunkCount = 0;

  // Track data flow through stream
  readable.on('data', (chunk) => {
    chunkCount++;
    totalBytesRead += chunk.length;
    console.log(`  - Chunk ${chunkCount}: ${chunk.length} bytes processed`);
  });

  // Pipe the stream with error handling
  readable.pipe(writable);

  readable.on('error', (err) => {
    console.error('❌ Read stream error:', err.message);
  });

  writable.on('error', (err) => {
    console.error('❌ Write stream error:', err.message);
  });

  writable.on('finish', () => {
    const fileSizeKB = (totalBytesRead / 1024).toFixed(2);
    console.log(`✓ streamFile: Finished copying file via ${chunkCount} chunks`);
    console.log(`  - Total bytes: ${totalBytesRead} bytes (${fileSizeKB} KB)`);
    console.log(`  - Memory usage: Constant (chunks only, not entire file)\n`);
  });
}

/**
 * ── PART 3: Key Differences & When to Use ──────────────────────────────────
 * 
 * fs.readFile() (Whole File in Memory):
 *   - Entire file loaded into Buffer before processing
 *   - Memory consumption = File size
 *   - Blocking until file is fully read
 *   - Simple API, suitable for small files
 *   - Example: 1GB file = 1GB of RAM used
 * 
 * fs.createReadStream() (Streaming in Chunks):
 *   - File processed in configurable chunks (default 16KB, can be adjusted)
 *   - Memory consumption = Chunk size (typically 16-64KB)
 *   - Non-blocking, events-driven
 *   - Ideal for large files or unknown file sizes
 *   - Example: 1GB file = 64KB of RAM used (with 64KB chunks)
 * 
 * Decision Tree:
 *   - File < 10MB? → Use readFile()
 *   - File > 100MB? → Use Stream
 *   - Unknown size?  → Use Stream
 *   - Real-time data? → Use Stream with transform
 */

// Run both approaches
console.log('═══════════════════════════════════════════════════════════\n');
readWholeFile();
streamFile();

module.exports = { readWholeFile, streamFile, INPUT, OUTPUT };