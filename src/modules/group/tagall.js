module.exports = {
  name: 'tagall',
  category: 'group',
  commands: ['tagall'],
  description: 'Tag semua anggota grup',
  cooldown: 600,
  adminOnly: true,
  groupOnly: true,
  async handler(ctx) {
    const participants = ctx.groupMetadata ? ctx.groupMetadata.participants : [];
    const mentions = participants.map((item) => item.id);
    const text = ctx.args.join(' ').trim() || 'Perhatian untuk semua anggota grup.';
    const body = `${text}\n\n${mentions.map((jid) => `@${jid.split('@')[0].split(':')[0]}`).join('\n')}`;
    await ctx.send(ctx.from, { text: body, mentions });
  }
};
