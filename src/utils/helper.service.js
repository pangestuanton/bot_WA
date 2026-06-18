const QRCode = require('qrcode');

async function createQrCode(text, options) {
  return QRCode.toBuffer(text, options);
}

module.exports = { createQrCode };
