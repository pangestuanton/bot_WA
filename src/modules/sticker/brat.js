module.exports = {
  name: 'brat',
  category: 'sticker',
  commands: ['brat'],
  description: 'Membuat brat sticker dari teks',
  cooldown: 5,
  async handler(ctx) {
    const text = ctx.args.join(' ').trim();
    if (!text) {
      await ctx.reply(`Teksnya belum ada.\n\nContoh:\n${ctx.prefix}brat halo Antoniqueee`);
      return;
    }
    if (text.length > 80) {
      await ctx.reply('Teks terlalu panjang. Maksimal 80 karakter.');
      return;
    }

    await ctx.client.sendMessage(ctx.from, { react: { text: '⏳', key: ctx.message.key } });
    const sticker = await ctx.services.media.createBratSticker(text);
    await ctx.send(ctx.from, { sticker });
    await ctx.client.sendMessage(ctx.from, { react: { text: '✅', key: ctx.message.key } });
  }
};
