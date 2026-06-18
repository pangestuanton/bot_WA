const { createRouter } = require('./router');
const { parseIncomingMessage } = require('./parser');

function registerClientEvents({ client, saveCreds, DisconnectReason, Boom, config, logger, services, repositories, pluginStore, restart }) {
  const router = createRouter({ config, logger, services, repositories, pluginStore });

  client.ev.on('creds.update', saveCreds);

  client.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;

    if (connection === 'open') {
      logger.info('Antoniqueee Bot siap digunakan');
    }

    if (connection === 'close') {
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      logger.warn({ statusCode }, 'Koneksi terputus');
      if (shouldReconnect && typeof restart === 'function') {
        await restart();
      }
    }
  });

  client.ev.on('group-participants.update', async (event) => {
    if (event.action === 'add') {
      await router.handleGroupJoin(event);
      return;
    }
    if (event.action === 'remove') {
      await router.handleGroupLeave(event);
    }
  });

  client.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') {
      return;
    }

    for (const message of messages) {
      if (!message.message || message.key.fromMe) {
        continue;
      }

      const parsed = await parseIncomingMessage({ client, message, config, logger });
      if (!parsed) {
        continue;
      }
      await router.handleMessage(parsed);
    }
  });
}

module.exports = { registerClientEvents };
