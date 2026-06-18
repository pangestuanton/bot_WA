const visual = require('../../utils/visual');

module.exports = {
  name: 'ping',
  category: 'core',
  commands: ['ping'],
  description: 'Cek respons bot',
  cooldown: 3,
  async handler(ctx) {
    const uptime = Math.floor(process.uptime());
    const lines = [
      visual.title('Pong'),
      visual.section('Status Bot', [
        visual.keyValue('Koneksi', 'Aktif'),
        visual.keyValue('Runtime', `${uptime} detik`),
        visual.keyValue('Prefix', ctx.prefix)
      ]),
      '',
      visual.footer([`Ketik ${ctx.prefix}menu untuk mulai menggunakan bot.`])
    ];

    await ctx.reply(lines.join('\n'));
  }
};
