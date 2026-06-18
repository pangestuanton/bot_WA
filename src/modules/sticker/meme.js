module.exports = {
  name: 'meme',
  category: 'sticker',
  commands: ['meme'],
  description: 'Membuat meme sticker',
  cooldown: 7,
  async handler(ctx) {
    const text = ctx.args.join(' ');
    const [topText, bottomText] = text.split('|').map((item) => (item || '').trim());
    if (!topText || !bottomText) {
      await ctx.reply(`Format salah.\nContoh: ${ctx.prefix}meme ATAS | BAWAH`);
      return;
    }

    const target = ctx.quotedMessage || ctx.message;
    if (ctx.services.media.getMediaType(target) !== 'image') {
      await ctx.reply('Kirim atau reply gambar dengan caption meme.');
      return;
    }

    await ctx.client.sendMessage(ctx.from, { react: { text: '⏳', key: ctx.message.key } });
    const media = await ctx.services.media.downloadMedia(target, ctx.client);
    const sticker = await ctx.services.media.createMemeSticker(media, topText, bottomText);
    await ctx.send(ctx.from, { sticker });
    await ctx.client.sendMessage(ctx.from, { react: { text: '✅', key: ctx.message.key } });
  }
};
