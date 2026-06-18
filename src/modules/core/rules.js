const visual = require('../../utils/visual');

module.exports = {
  name: 'rules',
  category: 'core',
  commands: ['rules'],
  description: 'Aturan penggunaan bot',
  cooldown: 5,
  async handler(ctx) {
    const lines = [
      visual.title('Aturan Bot'),
      visual.section('Gunakan Dengan Bijak', [
        '1. Jangan gunakan bot untuk spam.',
        '2. Jangan gunakan downloader untuk konten tanpa izin.',
        '3. Jangan kirim konten ilegal, berbahaya, atau menipu.',
        '4. Fitur grup hanya boleh dipakai admin sesuai kebutuhan.',
        '5. Gunakan bot secara wajar agar semua anggota nyaman.'
      ]),
      '',
      visual.footer([
        `Butuh daftar fitur? Ketik ${ctx.prefix}menu`,
        'Pelanggaran bisa membuat akses dibatasi.'
      ])
    ];

    await ctx.reply(lines.join('\n'));
  }
};
