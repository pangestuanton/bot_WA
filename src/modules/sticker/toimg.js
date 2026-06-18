module.exports = {
  name: 'toimg',
  category: 'sticker',
  commands: ['toimg', 'toimage'],
  description: 'Mengubah stiker ke gambar',
  cooldown: 5,
  async handler(ctx) {
    const target = ctx.quotedMessage;
    if (!target) {
      await ctx.reply('Reply stiker lalu kirim command ini.');
      return;
    }
    if (ctx.services.media.getMediaType(target) !== 'sticker') {
      await ctx.reply('Command ini hanya untuk stiker. Reply stiker yang ingin diubah ke gambar.');
      return;
    }

    await ctx.client.sendMessage(ctx.from, { react: { text: '⏳', key: ctx.message.key } });
    const media = await ctx.services.media.downloadMedia(target, ctx.client);
    const image = await ctx.services.media.stickerToImage(media);
    await ctx.send(ctx.from, { image, caption: 'Berhasil mengubah stiker ke gambar.' });
    await ctx.client.sendMessage(ctx.from, { react: { text: '✅', key: ctx.message.key } });
  }
};
