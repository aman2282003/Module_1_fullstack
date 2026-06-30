# Node Runtime Features — Streams Assignment

Learn to read files in two different ways and understand the fundamental differences between loading entire files into memory vs. processing them in chunks using streams.

## Run

```bash
npm start
```

## What This Project Does

This assignment demonstrates two critical file-reading patterns in Node.js:

### 1. **readWholeFile()** — Load Entire File into Memory
- Uses `fs.readFile()` to load the complete file into a Buffer
- Logs the file size in bytes
- **Memory Impact**: File size = RAM consumed
- **Good for**: Small files, configuration files, where you need the complete content immediately
- **Bad for**: Large files (100MB+), unbounded file sizes

### 2. **streamFile()** — Process File in Chunks
- Uses `fs.createReadStream()` to read the file in manageable chunks
- Pipes the readable stream to a writable stream
- Logs on the `finish` event when the entire file has been copied
- **Memory Impact**: Only chunk size (default 16-64KB) consumed at any time, regardless of total file size
- **Good for**: Large files, real-time data processing, video streaming, unknown file sizes
- **Bad for**: Simple scenarios where you need immediate complete file access

### 3. **Understanding the Trade-offs**

**fs.readFile() Approach:**
```
File (any size) → Entire Buffer → Event Callback
Memory used = File Size
Best for: < 10MB files
```

**Stream Approach:**
```
File (any size) → Chunk 1 (64KB) → Process → Chunk 2 (64KB) → Process → ...
Memory used = Chunk Size (constant)
Best for: > 100MB files or unknown sizes
```

## Key Concepts Explained

### Buffers
- Temporary storage for binary data
- Fixed size chunks of memory
- In streams, default chunk is 16KB (configurable via `highWaterMark`)

### Streams
- Objects that let you read data in chunks rather than all at once
- Implement event-driven architecture
- Support `pipe()` for elegant composition
- Handle backpressure automatically

### Piping
```javascript
readable.pipe(writable)
```
- Automatically manages data flow between streams
- Prevents memory overflow when read is faster than write
- More efficient than manual `.on('data')` handling

## File Structure

```
├── index.js           # Main implementation with both approaches
├── sample-data.txt    # Input file for reading
├── sample-copy.txt    # Output file (created by streamFile)
├── package.json       # Project configuration
└── README.md          # This file
```

## Expected Output

When you run `npm start`, you should see:
1. File size from `readWholeFile()` 
2. Chunk-by-chunk progress from `streamFile()`
3. Completion message showing total bytes processed

## Performance Comparison

For a 100MB file:
- **readFile()**: Uses 100MB RAM, then slowly processes the buffer
- **Stream()**: Uses 64KB RAM consistently, processes continuously

## Note

- `sample-data.txt` is provided for testing
- Running the script creates `sample-copy.txt` (this is expected behavior)
- The `highWaterMark` in `streamFile()` is set to 64KB for better visibility of chunk processing

