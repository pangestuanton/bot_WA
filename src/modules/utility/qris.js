const { createQrCode } = require('../../utils/helper.service');

module.exports = {
  name: 'qris',
  category: 'utility',
  commands: ['qris'],
  description: 'Membuat stiker QRIS',
  cooldown: 15,
  async handler(ctx) {
    const text = ctx.args.join(' ');
    const [nominal, note] = text.split('|').map((item) => (item || '').trim());

    if (!nominal || !/^\d+$/.test(nominal)) {
      await ctx.reply(`Format salah.\nContoh: ${ctx.prefix}qris 10000 | Untuk Antoniqueee`);
      return;
    }

    if (parseInt(nominal, 10) < 100) {
      await ctx.reply('Nominal minimal Rp 100.');
      return;
    }

    const phone = (ctx.config.qrisMerchantPhone || ctx.config.ownerPhone || '').replace(/^62/, '0');
    if (!phone) {
      await ctx.reply('Nomor merchant QRIS belum diatur di .env.');
      return;
    }

    await ctx.reply('Membuat stiker QRIS...');

    const city = (ctx.config.qrisMerchantCity || 'JAKARTA').slice(0, 11).toUpperCase();
    const merchant = (ctx.config.qrisMerchantName || 'ANTONIQUEEE').slice(0, 25).toUpperCase();
    const qrText = [
      `Merchant: ${merchant}`,
      `Kota: ${city}`,
      `Telepon: ${phone}`,
      `Nominal: Rp ${nominal}`,
      `Catatan: ${note || 'Pembayaran'}`
    ].join('\n');

    const qrBuffer = await createQrCode(qrText, {
      errorCorrectionLevel: 'H',
      width: 512,
      margin: 2,
      color: {
        dark: '#000000FF',
        light: '#FFFFFFFF'
      }
    });

    const sticker = await ctx.services.media.createStickerFromImage(qrBuffer);
    await ctx.send(ctx.from, { sticker });
  }
};
