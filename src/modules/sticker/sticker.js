module.exports = {
  name: 'sticker',
  category: 'sticker',
  commands: ['sticker', 's', 'sgif'],
  description: 'Membuat stiker dari gambar',
  cooldown: 5,
  async handler(ctx) {
    const target = ctx.quotedMessage || ctx.message;
    const mediaType = ctx.services.media.getMediaType(target);

    if (!mediaType) {
      await ctx.reply('Kirim atau reply gambar dengan command ini.');
      return;
    }
    if (mediaType !== 'image' && mediaType !== 'sticker') {
      await ctx.reply('Saat ini stiker hanya mendukung gambar atau stiker. Video belum diproses agar bot tetap stabil.');
      return;
    }

    await ctx.client.sendMessage(ctx.from, { react: { text: '⏳', key: ctx.message.key } });
    const media = await ctx.services.media.downloadMedia(target, ctx.client);
    const sticker = await ctx.services.media.createStickerFromImage(media);
    await ctx.send(ctx.from, { sticker });
    await ctx.client.sendMessage(ctx.from, { react: { text: '✅', key: ctx.message.key } });
  }
};
