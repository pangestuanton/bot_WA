const { createRateLimitMiddleware } = require('../middlewares/rate-limit.middleware');
const { createPermissionMiddleware } = require('../middlewares/permission.middleware');
const { createSafetyMiddleware } = require('../middlewares/safety.middleware');
const { createValidationMiddleware } = require('../middlewares/validation.middleware');
const visual = require('../utils/visual');

function createRouter({ config, logger, services, repositories, pluginStore }) {
  const rateLimit = createRateLimitMiddleware({ config, repositories });
  const permission = createPermissionMiddleware({ config, repositories });
  const safety = createSafetyMiddleware();
  const validation = createValidationMiddleware({ config });

  async function sendMessage(client, jid, content, options = {}) {
    logger.info({ jid, content: JSON.stringify(content) }, 'Attempting to send message');
    return client.sendMessage(jid, content, options);
  }

  async function runPlugin(parsed, plugin) {
    const ctx = {
      ...parsed,
      command: parsed.command,
      services,
      repositories,
      logger,
      config,
      pluginStore,
      reply: async (content, options = {}) => sendMessage(parsed.client, parsed.from, { text: content }, options),
      send: async (jid, content, options = {}) => sendMessage(parsed.client, jid, content, options)
    };

    try {
      await permission(ctx, plugin);
      await rateLimit(ctx, plugin);
      await safety(ctx, plugin);
      await validation(ctx, plugin);
      await plugin.handler(ctx);
      repositories.logs.create({
        userPhone: parsed.sender,
        groupJid: parsed.isGroup ? parsed.chat.id._serialized : null,
        command: parsed.command,
        args: parsed.args.join(' '),
        category: plugin.category,
        status: 'success'
      });
    } catch (error) {
      logger.error({ err: error, plugin: plugin.name }, 'Plugin gagal dieksekusi');
      repositories.logs.create({
        userPhone: parsed.sender,
        groupJid: parsed.isGroup ? parsed.chat.id._serialized : null,
        command: parsed.command,
        args: parsed.args.join(' '),
        category: plugin.category,
        status: 'error',
        errorMessage: error.message
      });
      await sendMessage(parsed.client, parsed.from, { text: error.message || 'Maaf, terjadi kesalahan. Coba lagi sebentar ya.' });
    }
  }

  return {
    async handleMessage(parsed) {
      if (parsed.isGroup) {
        await services.group.handleAntiLink(parsed);
      }

      if (!parsed.isCommand) {
        const activeSession = repositories.games.findActiveSession(parsed.isGroup ? parsed.chat.id._serialized : parsed.sender);
        if (activeSession) {
          await services.games.handleAnswer(parsed, activeSession);
        }
        return;
      }

      const plugin = pluginStore.commands.get(parsed.command);
      if (!plugin) {
        await sendMessage(parsed.client, parsed.from, {
          text: [
            visual.title('Command Tidak Dikenal'),
            `Command \`${parsed.prefix}${parsed.command}\` belum tersedia.`,
            '',
            visual.footer([`Ketik ${parsed.prefix}menu untuk melihat daftar fitur.`])
          ].join('\n')
        });
        return;
      }

      if (!plugin.enabled) {
        await sendMessage(parsed.client, parsed.from, {
          text: [
            visual.title('Fitur Nonaktif'),
            'Fitur ini sedang tidak tersedia.',
            '',
            visual.footer(['Coba fitur lain dari menu utama.'])
          ].join('\n')
        });
        return;
      }

      await runPlugin(parsed, plugin);
    },

    async handleGroupJoin(event) {
      await services.group.handleJoin(event, { client: pluginStore.client || null });
    },

    async handleGroupLeave(event) {
      await services.group.handleLeave(event, { client: pluginStore.client || null });
    }
  };
}

module.exports = { createRouter };
