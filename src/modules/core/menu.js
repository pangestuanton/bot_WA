const visual = require('../../utils/visual');

const CATEGORY_META = {
  core: { badge: '01', label: 'Menu Utama', tagline: 'Perintah dasar bot' },
  sticker: { badge: '02', label: 'Sticker Tools', tagline: 'Buat stiker dan meme' },
  ai: { badge: '03', label: 'AI Tools', tagline: 'Tanya jawab dengan AI' },
  group: { badge: '04', label: 'Group Tools', tagline: 'Kelola grup lebih mudah' },
  games: { badge: '05', label: 'Fun Games', tagline: 'Game ringan untuk chat' },
  utility: { badge: '06', label: 'Utility Tools', tagline: 'Alat bantu harian' },
  downloader: { badge: '07', label: 'Downloader', tagline: 'Nonaktif default, compliance-first' },
  owner: { badge: '08', label: 'Owner', tagline: 'Khusus pemilik bot' }
};

function sortCommands(commands) {
  return [...new Set(commands)].sort((a, b) => a.localeCompare(b));
}

module.exports = {
  name: 'menu',
  category: 'core',
  commands: ['menu', 'help', 'allmenu'],
  description: 'Menampilkan daftar command',
  cooldown: 3,
  async handler(ctx) {
    const byCategory = new Map();
    const plugins = ctx.pluginStore.plugins.filter((item) => item.enabled);

    for (const plugin of plugins) {
      if (!byCategory.has(plugin.category)) {
        byCategory.set(plugin.category, []);
      }
      byCategory.get(plugin.category).push(...plugin.commands.map((cmd) => `${ctx.prefix}${cmd}`));
    }

    const user = ctx.repositories.users.getOrCreate(ctx.sender, ctx.senderName);
    const orderedCategories = Object.keys(CATEGORY_META).filter((key) => byCategory.has(key));
    const role = ctx.isOwner ? 'Owner' : ctx.isAdmin ? 'Admin Grup' : 'User';

    const lines = [
      visual.title('Antoniqueee Bot'),
      visual.section('Ringkasan Pengguna', [
        visual.keyValue('Nama', ctx.senderName),
        visual.keyValue('Role', role),
        visual.keyValue('Premium', user.isPremium ? 'Ya' : 'Tidak'),
        visual.keyValue('Total Command', user.commandCount),
        visual.keyValue('Modul Aktif', plugins.length)
      ]),
      '',
      visual.section('Quick Start', [
        `> Coba: \`${ctx.prefix}sticker\` sambil reply gambar`,
        `> Tanya AI: \`${ctx.prefix}ai buat caption jualan\``,
        `> Game: \`${ctx.prefix}tebakkata\``
      ]),
      ''
    ];

    for (const category of orderedCategories) {
      const meta = CATEGORY_META[category] || { badge: '--', label: category, tagline: 'Modul bot' };
      const commands = sortCommands(byCategory.get(category) || []);
      lines.push(`*[${meta.badge}] ${meta.label}*`);
      lines.push(`_${meta.tagline}_`);
      lines.push(visual.commandList(commands, 3));
      lines.push('');
    }

    lines.push(visual.footer([
      `Ketik ${ctx.prefix}rules untuk aturan bot.`,
      `Ketik ${ctx.prefix}profile untuk melihat profil kamu.`,
      'Gunakan fitur secara wajar dan aman.'
    ]));

    await ctx.reply(lines.join('\n'));
  }
};
