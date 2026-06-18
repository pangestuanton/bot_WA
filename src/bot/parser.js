function unwrapMessage(message = {}) {
  return message.ephemeralMessage?.message
    || message.viewOnceMessage?.message
    || message.viewOnceMessageV2?.message
    || message.documentWithCaptionMessage?.message
    || message;
}

function getTextFromMessage(message) {
  const payload = unwrapMessage(message);
  return payload.conversation
    || payload.extendedTextMessage?.text
    || payload.imageMessage?.caption
    || payload.videoMessage?.caption
    || payload.buttonsResponseMessage?.selectedButtonId
    || payload.listResponseMessage?.title
    || '';
}

function normalizeJid(jid = '') {
  return String(jid).split(':')[0].replace(/@s\.whatsapp\.net$/, '@s.whatsapp.net');
}

async function parseIncomingMessage({ client, message, config }) {
  const body = getTextFromMessage(message.message || {}).trim();
  const prefix = config.prefix;
  const isCommand = body.startsWith(prefix);
  const withoutPrefix = isCommand ? body.slice(prefix.length).trim() : '';
  const parts = withoutPrefix ? withoutPrefix.split(/\s+/) : [];
  const command = parts.length ? parts[0].toLowerCase() : '';
  const args = parts.slice(1);
  const remoteJid = message.key.remoteJid;
  const isGroup = remoteJid.endsWith('@g.us');
  const senderJid = isGroup ? (message.key.participant || '') : remoteJid;
  const sender = senderJid.split('@')[0];
  const senderName = message.pushName || 'Pengguna';
  const content = unwrapMessage(message.message || {});
  const contextInfo = content.extendedTextMessage?.contextInfo
    || content.imageMessage?.contextInfo
    || content.videoMessage?.contextInfo
    || {};
  const quotedMessage = contextInfo.quotedMessage
    ? {
        key: {
          remoteJid,
          id: contextInfo.stanzaId,
          participant: contextInfo.participant
        },
        message: contextInfo.quotedMessage
      }
    : null;

  let groupMetadata = null;
  let isAdmin = false;
  let isBotAdmin = false;

  if (isGroup) {
    groupMetadata = await client.groupMetadata(remoteJid);
    const normalizedSenderJid = normalizeJid(senderJid);
    const meId = normalizeJid(client.user.id);
    const senderParticipant = groupMetadata.participants.find((item) => normalizeJid(item.id) === normalizedSenderJid);
    const meParticipant = groupMetadata.participants.find((item) => normalizeJid(item.id) === meId);
    isAdmin = Boolean(senderParticipant && ['admin', 'superadmin'].includes(senderParticipant.admin));
    isBotAdmin = Boolean(meParticipant && ['admin', 'superadmin'].includes(meParticipant.admin));
  }

  return {
    client,
    message,
    body,
    prefix,
    isCommand,
    command,
    args,
    chat: { id: { _serialized: remoteJid } },
    contact: { pushname: senderName, name: senderName },
    quotedMessage,
    sender,
    senderJid,
    senderName,
    mentionedJids: contextInfo.mentionedJid || [],
    isGroup,
    isAdmin,
    isBotAdmin,
    groupMetadata,
    from: remoteJid
  };
}

module.exports = { parseIncomingMessage, getTextFromMessage, unwrapMessage };
