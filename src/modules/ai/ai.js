module.exports = {
  name: 'ai',
  category: 'ai',
  commands: ['ai', 'ask'],
  description: 'AI Chatbot Antoniqueee Bot',
  cooldown: 5,
  async handler(ctx) {
    const prompt = ctx.args.join(' ').trim();
    if (!prompt) {
      await ctx.reply(`Halo! Aku Antoniqueee Bot. Apa yang bisa aku bantu hari ini?`);
      return;
    }
    await ctx.client.sendPresenceUpdate('composing', ctx.from);
    const result = await ctx.services.ai.askAI({ config: ctx.config, repositories: ctx.repositories, sender: ctx.sender, prompt });
    await ctx.reply(`*Antoniqueee Bot AI:*\n\n${result}`);
  }
};
