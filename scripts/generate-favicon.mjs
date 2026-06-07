/**
 * Generates public/favicon.ico — a 32x32 + 16x16 multi-size ICO file
 * containing the Purtivon brand mark: dark bg + gold diamond outline + gold P.
 *
 * Run once:  node scripts/generate-favicon.mjs
 * No external dependencies — uses only Node.js built-ins.
 */

import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT   = join(__dir, '..', 'public');

// ── Brand colours ──────────────────────────────────────────────────────────
const BG   = [6,   7,  15, 255];   // #06070f
const GOLD = [201, 168, 76, 255];  // #c9a84c

// ── Pixel canvas helpers ────────────────────────────────────────────────────
function makeCanvas(size) {
  const data = new Uint8Array(size * size * 4);
  // Fill background
  for (let i = 0; i < size * size; i++) {
    data[i * 4 + 0] = BG[0];
    data[i * 4 + 1] = BG[1];
    data[i * 4 + 2] = BG[2];
    data[i * 4 + 3] = BG[3];
  }
  return data;
}

function setPixel(data, size, x, y, color, alpha = 255) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  const i = (y * size + x) * 4;
  // Alpha-composite over the existing pixel
  const a = alpha / 255;
  data[i + 0] = Math.round(color[0] * a + data[i + 0] * (1 - a));
  data[i + 1] = Math.round(color[1] * a + data[i + 1] * (1 - a));
  data[i + 2] = Math.round(color[2] * a + data[i + 2] * (1 - a));
  data[i + 3] = 255;
}

// ── Design renderer ─────────────────────────────────────────────────────────
function drawIcon(size) {
  const data = makeCanvas(size);

  // Half-pixel centre so lines straddle the centre evenly
  const cx = size / 2;
  const cy = size / 2;

  // Diamond outer radius (in Manhattan-distance units)
  // Scale from the 32-px reference design (radius ≈ 10.5)
  const radius = size * (10.5 / 32);
  const thick  = size * (1.25 / 32);

  // ── Diamond outline ───────────────────────────────────────────────────────
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Manhattan distance from the visual centre
      const d = Math.abs(x + 0.5 - cx) + Math.abs(y + 0.5 - cy);
      const inner = radius - thick;
      const outer = radius + thick;
      if (d >= inner && d <= outer) {
        // Smooth anti-aliased edges
        let alpha;
        if (d < inner + 1) {
          alpha = Math.round((d - inner) * 255);
        } else if (d > outer - 1) {
          alpha = Math.round((outer - d) * 255);
        } else {
          alpha = 255;
        }
        setPixel(data, size, x, y, GOLD, alpha);
      }
    }
  }

  // ── P monogram ────────────────────────────────────────────────────────────
  // Scale from 32-px reference: x=9..11, y=8..23 vertical bar;
  // bowl top x=9..20, y=8..10; middle x=9..20, y=14..16; right x=18..20, y=10..14
  const s = size / 32;
  const rect = (x0, y0, x1, y1) => {
    for (let y = Math.round(y0 * s); y <= Math.round(y1 * s); y++) {
      for (let x = Math.round(x0 * s); x <= Math.round(x1 * s); x++) {
        setPixel(data, size, x, y, GOLD);
      }
    }
  };

  rect(9, 8, 11, 23);   // vertical bar
  rect(9, 8, 20, 10);   // top horizontal (bowl top)
  rect(9, 14, 20, 16);  // middle horizontal (bowl bottom)
  rect(18, 10, 20, 14); // right side of bowl

  return data;
}

// ── PNG encoder (no dependencies) ────────────────────────────────────────────
function crc32(buf) {
  let crc = -1;
  const table = crc32.table || (crc32.table = (() => {
    const t = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      t[i] = c;
    }
    return t;
  })());
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len  = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBytes, data, crcBuf]);
}

function encodePNG(pixels, size) {
  // Build raw scanlines: filter_byte(0) + RGBA × width per row
  const raw = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    raw[y * (1 + size * 4)] = 0; // filter = None
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * (1 + size * 4) + 1 + x * 4;
      raw[dst + 0] = pixels[src + 0];
      raw[dst + 1] = pixels[src + 1];
      raw[dst + 2] = pixels[src + 2];
      raw[dst + 3] = pixels[src + 3];
    }
  }
  const compressed = deflateSync(raw, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8]  = 8;  // bit depth
  ihdr[9]  = 6;  // color type: RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ── ICO encoder ───────────────────────────────────────────────────────────────
// ICO format supports multiple sizes; we embed 32×32 and 16×16.
function encodeICO(pngs) {
  const count  = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);     // reserved
  header.writeUInt16LE(1, 2);     // type: 1 = ICO
  header.writeUInt16LE(count, 4); // number of images

  const dirEntrySize = 16;
  let offset = 6 + count * dirEntrySize;

  const dirs = [];
  for (const { png, size } of pngs) {
    const entry = Buffer.alloc(dirEntrySize);
    entry[0] = size === 256 ? 0 : size;  // width  (0 = 256)
    entry[1] = size === 256 ? 0 : size;  // height (0 = 256)
    entry[2] = 0;                         // palette size (0 = no palette)
    entry[3] = 0;                         // reserved
    entry.writeUInt16LE(1,   4);          // color planes
    entry.writeUInt16LE(32,  6);          // bits per pixel
    entry.writeUInt32LE(png.length,  8);  // size of image data
    entry.writeUInt32LE(offset,     12);  // offset of image data
    offset += png.length;
    dirs.push(entry);
  }

  return Buffer.concat([header, ...dirs, ...pngs.map(p => p.png)]);
}

// ── Main ─────────────────────────────────────────────────────────────────────
const sizes = [32, 16];
const pngs  = sizes.map(size => ({
  size,
  png: encodePNG(drawIcon(size), size),
}));

mkdirSync(OUT, { recursive: true });

const ico = encodeICO(pngs);
writeFileSync(join(OUT, 'favicon.ico'), ico);
console.log(`✓ public/favicon.ico  (${ico.length} bytes, sizes: ${sizes.join(', ')})`);

// Also write individual PNGs for completeness
const png32 = encodePNG(drawIcon(32), 32);
const png180 = encodePNG(drawIcon(180), 180);
const png192 = encodePNG(drawIcon(192), 192);
const png512 = encodePNG(drawIcon(512), 512);

writeFileSync(join(OUT, 'favicon-32x32.png'),            png32);
writeFileSync(join(OUT, 'apple-touch-icon.png'),         png180);
writeFileSync(join(OUT, 'android-chrome-192x192.png'),   png192);
writeFileSync(join(OUT, 'android-chrome-512x512.png'),   png512);

console.log('✓ public/favicon-32x32.png');
console.log('✓ public/apple-touch-icon.png (180×180)');
console.log('✓ public/android-chrome-192x192.png');
console.log('✓ public/android-chrome-512x512.png');
