module.exports = {
  name: 'score',
  category: 'games',
  commands: ['score', 'leaderboard'],
  description: 'Melihat skor game',
  cooldown: 5,
  async handler(ctx) {
    if (ctx.command === 'score') {
      const score = ctx.repositories.games.getScore(ctx.sender, 'tebakkata');
      await ctx.reply(`Skor tebak kata kamu: ${score.score}`);
      return;
    }
    const items = ctx.repositories.games.top('tebakkata', 10);
    if (!items.length) {
      await ctx.reply('Belum ada skor untuk leaderboard.');
      return;
    }
    const lines = items.map((item, index) => `${index + 1}. ${item.userPhone} - ${item.score}`);
    await ctx.reply(`Leaderboard Tebak Kata\n${lines.join('\n')}`);
  }
};
