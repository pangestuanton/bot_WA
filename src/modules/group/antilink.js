module.exports = {
  name: 'antilink',
  category: 'group',
  commands: ['antilink'],
  description: 'Mengatur anti-link',
  cooldown: 5,
  adminOnly: true,
  groupOnly: true,
  async handler(ctx) {
    const mode = (ctx.args[0] || '').toLowerCase();
    const action = (ctx.args[1] || 'warn').toLowerCase();
    if (!['on', 'off'].includes(mode) || !['warn', 'kick'].includes(action)) {
      await ctx.reply(`Gunakan ${ctx.prefix}antilink on [warn/kick] atau ${ctx.prefix}antilink off`);
      return;
    }
    ctx.repositories.groups.updateSettings(ctx.chat.id._serialized, {
      antilinkEnabled: mode === 'on',
      antilinkAction: action
    });
    await ctx.reply(`Anti-link berhasil di${mode === 'on' ? 'aktifkan' : 'nonaktifkan'} dengan aksi ${action}.`);
  }
};
