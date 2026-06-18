function createValidationMiddleware({ config }) {
  return async function validation(ctx, plugin) {
    if (plugin.category === 'ai') {
      const prompt = ctx.args.join(' ').trim();
      if (prompt.length > 1000) {
        throw new Error('Pertanyaannya terlalu panjang. Coba ringkas dulu ya.');
      }
    }

    if ((plugin.name === 'sticker' || plugin.name === 'meme' || plugin.name === 'toimg') && !config.modules.sticker) {
      throw new Error('Modul sticker sedang nonaktif.');
    }
  };
}

module.exports = { createValidationMiddleware };
