// The World in One Picture — Saturday 21 November 2026.
// The entry is the poster beside this file: one frame summing up the day's world news —
// a Russian double-tap strike on Kryvyi Rih; Mexico capturing cartel boss "El Chapo
// Isidro"; COP31 climate talks grinding into overtime in Antalya; and Russian missiles
// landing in Poland. This program's whole job is to hand that image in, byte for byte,
// and to prove on the way that what landed in /output is exactly the poster it meant
// to hand in.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const src = new URL('./entry.png', import.meta.url);
// The gate refuses anything over 1 MiB, and this contest's frame is exactly 1024x1024;
// fail loudly here rather than hand in an image the scorer would zero out. Read the PNG
// header itself so a wrong-sized file is caught even if its byte count looks fine.
const buf = readFileSync(src);
if (buf.length > 1_048_576) throw new Error(`entry.png is ${buf.length} bytes, over the 1 MiB gate limit`);
if (buf.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('entry.png is not a PNG');
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
if (width !== 1024 || height !== 1024) throw new Error(`entry.png is ${width}x${height}, not the 1024x1024 this contest scores`);

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
const dest = join(out, 'entry.png');
copyFileSync(src, dest);

// Prove the hand-in: what the scorer opens must be the poster, byte for byte —
// a length check alone would wave through a same-size corruption, so compare digests.
const landed = readFileSync(dest);
const digest = (b: Buffer): string => createHash('sha256').update(b).digest('hex');
if (landed.length !== buf.length || digest(landed) !== digest(buf)) {
  throw new Error(`copied entry.png differs from the source (${landed.length} vs ${buf.length} bytes)`);
}
console.log(`entry.png handed in: ${landed.length} bytes, ${width}x${height}, sha256 ${digest(landed).slice(0, 12)}…`);
