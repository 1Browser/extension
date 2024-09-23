import config from './config';
import * as pako from 'pako';

function encrypt(index: number, prev: number, len: number, value: number): number {
  return (value + index + prev + len) % 256; // 简单示例加密
}

function decrypt(index: number, prev: number, len: number, value: number): number {
  return (value - index - prev - len + 256) % 256; // 简单示例解密
}

export async function decode(s: string): Promise<string> {
  const reduction: number[] = [...s.trim()].map(c => {
    const index = config.dict.indexOf(c);
    if (index === -1) {
      throw new Error('Fail to decode.');
    }
    return index;
  });

  const clear: Uint8Array = new Uint8Array(reduction.length - 1);
  for (let index = 1; index < reduction.length; index++) {
    clear[index - 1] = decrypt(index, reduction[index - 1], reduction.length - 1, reduction[index]);
  }

  let decompressed: Uint8Array;
  try {
    decompressed = pako.inflate(clear);
  } catch (error) {
    decompressed = clear;
  }

  let result: string = new TextDecoder().decode(decompressed);

  for (const [original, replacement] of config.key_words) {
    result = result.replace(new RegExp(replacement, 'g'), original);
  }
  return result;
}

export async function encode(s: string): Promise<string> {
  let buf = s.trim();

  for (const [original, replacement] of config.key_words) {
    buf = buf.replace(new RegExp(original, 'g'), replacement);
  }

  const compressed = pako.deflate(new TextEncoder().encode(buf), { level: config.zstd_level });

  const shouldCompress = buf.length > compressed.length;
  const short = shouldCompress ? compressed : new TextEncoder().encode(buf);

  const random = window.crypto.getRandomValues(new Uint8Array(1))[0];

  const cipher: number[] = [random];

  for (let index = 1; index <= short.length; index++) {
    cipher.push(encrypt(index, cipher[index - 1], short.length, short[index - 1]));
  }

  return cipher.map(c => config.dict[c]).join('');
}

export { default as config } from './config';
