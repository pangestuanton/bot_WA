module.exports = {
  name: 'calc',
  category: 'utility',
  commands: ['calc'],
  description: 'Kalkulator aman',
  cooldown: 3,
  async handler(ctx) {
    const expression = ctx.args.join(' ').trim();
    if (!expression) {
      await ctx.reply(`Contoh: ${ctx.prefix}calc (10+5)*2`);
      return;
    }
    if (expression.length > 80) {
      await ctx.reply('Ekspresi terlalu panjang. Maksimal 80 karakter.');
      return;
    }
    if (!/^[0-9+\-*/().%\s]+$/.test(expression)) {
      await ctx.reply('Ekspresi tidak valid. Hanya angka dan operator dasar yang diperbolehkan.');
      return;
    }
    const result = Function(`'use strict'; return (${expression})`)();
    if (!Number.isFinite(result)) {
      await ctx.reply('Hasil tidak valid.');
      return;
    }
    await ctx.reply(`Hasil: ${result}`);
  }
};
