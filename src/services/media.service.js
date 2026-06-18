const sharp = require('sharp');
const { downloadMediaMessage } = require('sanka-baileyss');
const { unwrapMessage } = require('../bot/parser');

function getMediaMessage(message = {}) {
  const payload = unwrapMessage(message.message || message);
  return payload.imageMessage
    || payload.videoMessage
    || payload.stickerMessage
    || payload.documentMessage
    || null;
}

function getMediaType(message = {}) {
  const payload = unwrapMessage(message.message || message);
  if (payload.imageMessage) return 'image';
  if (payload.videoMessage) return 'video';
  if (payload.stickerMessage) return 'sticker';
  if (payload.documentMessage) return 'document';
  return null;
}

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function wrapText(text, maxCharsPerLine = 12, maxLines = 6) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxCharsPerLine) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = '';
    }

    if (word.length <= maxCharsPerLine) {
      currentLine = word;
      continue;
    }

    let chunk = word;
    while (chunk.length > maxCharsPerLine && lines.length < maxLines) {
      lines.push(chunk.slice(0, maxCharsPerLine));
      chunk = chunk.slice(maxCharsPerLine);
    }
    currentLine = chunk;
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  return lines.slice(0, maxLines);
}

async function downloadMedia(target, client) {
  if (!target || !getMediaMessage(target)) {
    return null;
  }

  try {
    return await downloadMediaMessage(target, 'buffer', {}, {
      logger: client.logger,
      reuploadRequest: client.updateMediaMessage
    });
  } catch (error) {
    throw new Error('Media tidak bisa diunduh. Coba kirim ulang atau gunakan media lain.');
  }
}

async function createStickerFromImage(buffer) {
  try {
    return await sharp(buffer)
      .resize(512, 512, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 90 })
      .toBuffer();
  } catch (error) {
    throw new Error('Media ini belum bisa dijadikan stiker. Gunakan gambar JPG, PNG, atau WebP.');
  }
}

async function createBratSticker(text) {
  const lines = wrapText(text);
  const fontSize = lines.length <= 2 ? 58 : lines.length <= 4 ? 50 : 42;
  const lineHeight = Math.round(fontSize * 1.2);
  const startY = Math.round(256 - ((lines.length - 1) * lineHeight) / 2);
  const tspans = lines
    .map((line, index) => `<tspan x="256" y="${startY + index * lineHeight}">${escapeXml(line)}</tspan>`)
    .join('');

  const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><rect width="512" height="512" fill="white"/><text x="256" y="256" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${fontSize}" font-weight="900" fill="#111111">${tspans}</text></svg>`;
  return sharp(Buffer.from(svg)).webp({ quality: 90 }).toBuffer();
}

async function stickerToImage(buffer) {
  try {
    return await sharp(buffer).png().toBuffer();
  } catch (error) {
    throw new Error('Stiker ini tidak bisa diubah menjadi gambar.');
  }
}

async function createMemeSticker(buffer, topText, bottomText) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const width = metadata.width || 512;
  const height = metadata.height || 512;
  const overlay = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><style>.t{font-family:Arial,sans-serif;font-size:42px;font-weight:700;fill:white;stroke:black;stroke-width:2;paint-order:stroke;text-anchor:middle;}</style><text x="50%" y="56" class="t">${escapeXml(topText)}</text><text x="50%" y="${height - 24}" class="t">${escapeXml(bottomText)}</text></svg>`;
  try {
    return await image.composite([{ input: Buffer.from(overlay), top: 0, left: 0 }]).webp().toBuffer();
  } catch (error) {
    throw new Error('Gagal membuat meme. Gunakan gambar JPG, PNG, atau WebP.');
  }
}

module.exports = {
  downloadMedia,
  getMediaType,
  createStickerFromImage,
  createBratSticker,
  stickerToImage,
  createMemeSticker
};
