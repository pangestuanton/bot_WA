module.exports = {
  name: 'lyric',
  category: 'utility',
  commands: ['lyric', 'lirik'],
  description: 'Membuat stiker lirik lagu',
  cooldown: 20,
  async handler(ctx) {
    const query = ctx.args.join(' ').trim();
    if (!query) {
      await ctx.reply(`Judul lagunya apa?\nContoh: ${ctx.prefix}lyric Judul Lagu - Artis`);
      return;
    }

    await ctx.reply('Mencari lirik dan membuat stiker...');

    const lyrics = await ctx.services.lyric.findLyrics(query);
    const sticker = await ctx.services.media.createBratSticker(lyrics);

    await ctx.send(ctx.from, { sticker });
  }
};
