const visual = require('../../utils/visual');

module.exports = {
  name: 'profile',
  category: 'core',
  commands: ['profile', 'me'],
  description: 'Profil pengguna',
  cooldown: 5,
  async handler(ctx) {
    const user = ctx.repositories.users.getOrCreate(ctx.sender, ctx.senderName);
    const role = ctx.isOwner ? 'Owner' : ctx.isAdmin ? 'Admin Grup' : user.role;
    const lines = [
      visual.title('Profil Kamu'),
      visual.section('Identitas', [
        visual.keyValue('Nama', user.name),
        visual.keyValue('Nomor', ctx.sender),
        visual.keyValue('Role', role),
        visual.keyValue('Premium', user.isPremium ? 'Ya' : 'Tidak')
      ]),
      '',
      visual.section('Aktivitas', [
        visual.keyValue('Jumlah Command', user.commandCount),
        visual.keyValue('Status', user.isBanned ? 'Dibatasi' : 'Aktif')
      ])
    ];

    await ctx.reply(lines.join('\n'));
  }
};
