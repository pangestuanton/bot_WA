module.exports = {
  name: 'tebakkata',
  category: 'games',
  commands: ['tebakkata'],
  description: 'Mulai game tebak kata',
  cooldown: 10,
  async handler(ctx) {
    const scopeId = ctx.isGroup ? ctx.chat.id._serialized : ctx.sender;
    const session = ctx.services.games.startGuess(scopeId, ctx.sender);
    await ctx.reply(`Game tebak kata dimulai!\n\nPertanyaan: ${session.question}\nHint: ${session.hint}`);
  }
};
