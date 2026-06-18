module.exports = {
  name: 'downloader',
  category: 'downloader',
  commands: ['tiktok', 'tt', 'ig', 'yt', 'ytmp3', 'ytmp4', 'spotify'],
  description: 'Placeholder downloader aman',
  cooldown: 60,
  async handler(ctx) {
    await ctx.reply('Downloader sedang nonaktif secara default. Jika diaktifkan, fitur ini hanya untuk konten publik, milik sendiri, atau yang memang berizin untuk diunduh.');
  }
};
