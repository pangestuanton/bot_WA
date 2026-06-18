module.exports = {
  name: 'tts',
  category: 'utility',
  commands: ['tts'],
  description: 'Text to speech',
  cooldown: 10,
  async handler(ctx) {
    const { language, text } = ctx.services.tts.parseTtsArgs(ctx.args);
    if (!text) {
      await ctx.reply(`Contoh: ${ctx.prefix}tts id halo semuanya`);
      return;
    }
    const audio = await ctx.services.tts.textToSpeech(text, language);
    await ctx.send(ctx.from, { audio, mimetype: 'audio/mpeg', ptt: true });
  }
};
