module.exports = {
  name: 'kick',
  category: 'group',
  commands: ['kick'],
  description: 'Mengeluarkan anggota grup',
  cooldown: 10,
  adminOnly: true,
  groupOnly: true,
  async handler(ctx) {
    if (!ctx.isBotAdmin) {
      await ctx.reply('Bot harus jadi admin dulu untuk kick anggota.');
      return;
    }
    const target = ctx.mentionedJids[0];
    if (!target) {
      await ctx.reply('Tag anggota yang mau dikeluarkan ya.');
      return;
    }
    await ctx.client.groupParticipantsUpdate(ctx.from, [target], 'remove');
    await ctx.reply('Anggota berhasil dikeluarkan.');
  }
};
