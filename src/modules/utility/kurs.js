module.exports = {
  name: 'kurs',
  category: 'utility',
  commands: ['kurs'],
  description: 'Konversi kurs mata uang',
  cooldown: 10,
  async handler(ctx) {
    const [amountRaw, from, to] = ctx.args;
    const amount = Number(amountRaw);

    if (!amountRaw || !from || !to || !Number.isFinite(amount) || amount <= 0) {
      await ctx.reply(`Format salah.\nContoh: ${ctx.prefix}kurs 10 USD IDR`);
      return;
    }

    const result = await ctx.services.currency.convertCurrency({ amount, from, to });
    await ctx.reply(`*Konversi Kurs*\n\n${result.amount} ${result.from} = ${result.result.toFixed(2)} ${result.to}\nRate: 1 ${result.from} = ${result.rate.toFixed(4)} ${result.to}`);
  }
};
