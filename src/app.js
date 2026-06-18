const path = require('path');
const fs = require('fs-extra');
const dotenv = require('dotenv');
const { createBotClient } = require('./bot/client');
const { registerClientEvents } = require('./bot/events');
const { loadConfig } = require('./config');
const { createServices } = require('./services');
const { createRepositories } = require('./repositories');
const { loadPlugins } = require('./modules');
const { createLogger } = require('./utils/logger');

dotenv.config();

async function bootstrap() {
  const config = loadConfig();
  const logger = createLogger(config);

  await Promise.all([
    fs.ensureDir(path.join(process.cwd(), 'logs')),
    fs.ensureDir(path.join(process.cwd(), 'temp')),
    fs.ensureDir(path.join(process.cwd(), 'uploads')),
    fs.ensureDir(path.join(process.cwd(), 'src', 'data'))
  ]);

  const repositories = createRepositories({ config, logger });
  const services = createServices({ config, logger, repositories });
  const pluginStore = await loadPlugins({ config, logger, services, repositories });

  async function startClient() {
    const { client, saveCreds, DisconnectReason, Boom } = await createBotClient({ config, logger });
    pluginStore.client = client;
    registerClientEvents({ client, saveCreds, DisconnectReason, Boom, config, logger, services, repositories, pluginStore, restart: startClient });
  }

  process.on('unhandledRejection', (error) => {
    logger.error({ err: error }, 'Unhandled promise rejection');
  });

  process.on('uncaughtException', (error) => {
    logger.error({ err: error }, 'Uncaught exception');
  });

  logger.info({ pluginCount: pluginStore.plugins.length }, 'Memulai Antoniqueee Bot');
  await startClient();
}

bootstrap().catch((error) => {
  process.stderr.write(`Gagal menjalankan bot: ${error.message}\n`);
  process.exit(1);
});
