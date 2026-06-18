module.exports = {
  name: 'welcome',
  category: 'group',
  commands: ['welcome', 'goodbye'],
  description: 'Mengatur welcome dan goodbye',
  cooldown: 5,
  adminOnly: true,
  groupOnly: true,
  async handler(ctx) {
    const mode = (ctx.args[0] || '').toLowerCase();
    if (!['on', 'off'].includes(mode)) {
      await ctx.reply(`Gunakan ${ctx.prefix}${ctx.command} on atau ${ctx.prefix}${ctx.command} off`);
      return;
    }
    const patch = ctx.command === 'welcome' ? { welcomeEnabled: mode === 'on' } : { goodbyeEnabled: mode === 'on' };
    ctx.repositories.groups.updateSettings(ctx.chat.id._serialized, patch);
    await ctx.reply(`Fitur ${ctx.command} berhasil di${mode === 'on' ? 'aktifkan' : 'nonaktifkan'}.`);
  }
};
