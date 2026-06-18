module.exports = {
  name: 'groupcontrol',
  category: 'group',
  commands: ['opengroup', 'closegroup'],
  description: 'Buka atau tutup grup',
  cooldown: 15,
  adminOnly: true,
  groupOnly: true,
  async handler(ctx) {
    if (!ctx.isBotAdmin) {
      await ctx.reply('Bot harus jadi admin dulu untuk mengatur grup.');
      return;
    }
    const setting = ctx.command === 'closegroup' ? 'announcement' : 'not_announcement';
    await ctx.client.groupSettingUpdate(ctx.from, setting);
    await ctx.reply(`Grup berhasil di${ctx.command === 'closegroup' ? 'tutup' : 'buka'}.`);
  }
};
