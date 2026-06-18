const visual = require('../utils/visual');

function containsLink(text) {
  return /(https?:\/\/|www\.)\S+/i.test(text || '');
}

function createGroupService({ repositories }) {
  return {
    async handleJoin(event, { client }) {
      if (!client) {
        return;
      }
      const settings = repositories.groups.getSettings(event.id);
      if (!settings.welcomeEnabled) {
        return;
      }
      await client.sendMessage(event.id, {
        text: [
          visual.title('Selamat Datang'),
          'Ada anggota baru di grup.',
          '',
          visual.section('Mulai Dari Sini', [
            '> Baca rules grup.',
            '> Gunakan bot dengan wajar.',
            '> Ketik .menu untuk melihat fitur bot.'
          ])
        ].join('\n')
      });
    },

    async handleLeave(event, { client }) {
      if (!client) {
        return;
      }
      const settings = repositories.groups.getSettings(event.id);
      if (!settings.goodbyeEnabled) {
        return;
      }
      await client.sendMessage(event.id, {
        text: [
          visual.title('Goodbye'),
          'Satu anggota meninggalkan grup.',
          '',
          visual.footer(['Semoga harimu menyenangkan.'])
        ].join('\n')
      });
    },

    async handleAntiLink(parsed) {
      if (!parsed.isGroup || parsed.isAdmin) {
        return;
      }
      const settings = repositories.groups.getSettings(parsed.chat.id._serialized);
      if (!settings.antilinkEnabled || !containsLink(parsed.body)) {
        return;
      }
      const warning = repositories.warnings.add(parsed.chat.id._serialized, parsed.sender, 'Mengirim link saat anti-link aktif');
      await parsed.client.sendMessage(parsed.from, { text: `Link terdeteksi. Peringatan kamu sekarang ${warning.warningCount}/${settings.maxWarning}.` }, { quoted: parsed.message });

      if (settings.antilinkAction === 'kick' && warning.warningCount >= settings.maxWarning) {
        if (!parsed.isBotAdmin) {
          await parsed.client.sendMessage(parsed.from, { text: 'Batas peringatan tercapai, tetapi bot belum menjadi admin untuk mengeluarkan anggota.' });
          return;
        }
        await parsed.client.groupParticipantsUpdate(parsed.from, [parsed.senderJid], 'remove');
        repositories.warnings.clear(parsed.chat.id._serialized, parsed.sender);
      }
    }
  };
}

module.exports = { createGroupService };
