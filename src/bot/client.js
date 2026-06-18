const pino = require('pino');
const { Boom } = require('@hapi/boom');
const makeWASocket = require('sanka-baileyss').default;
const { Browsers, DisconnectReason, useMultiFileAuthState } = require('sanka-baileyss');

async function createBotClient({ config, logger }) {
  const { state, saveCreds } = await useMultiFileAuthState(config.sessionPath);

  const client = makeWASocket({
    auth: state,
    printQRInTerminal: true,
    browser: Browsers.ubuntu(config.appName || 'Antoniqueee Bot'),
    markOnlineOnConnect: false,
    syncFullHistory: false,
    logger: pino({ level: config.logLevel || 'silent' })
  });

  return { client, saveCreds, DisconnectReason, Boom };
}

module.exports = { createBotClient };
