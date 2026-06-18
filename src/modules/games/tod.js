module.exports = {
  name: 'tod',
  category: 'games',
  commands: ['tod', 'truth', 'dare'],
  description: 'Truth or Dare aman',
  cooldown: 5,
  async handler(ctx) {
    const truths = ['Apa kebiasaan kecilmu yang paling aneh?', 'Hal apa yang paling ingin kamu pelajari tahun ini?'];
    const dares = ['Kirim satu kalimat motivasi ke grup.', 'Sebutkan tiga makanan favoritmu.'];
    const isTruth = ctx.command === 'truth' || (ctx.command === 'tod' && Math.random() > 0.5);
    const item = isTruth ? truths[Math.floor(Math.random() * truths.length)] : dares[Math.floor(Math.random() * dares.length)];
    await ctx.reply(`${isTruth ? 'Truth' : 'Dare'}: ${item}`);
  }
};
