const path = require('path');

function toBool(value, fallback = false) {
  if (value === undefined) {
    return fallback;
  }
  return String(value).toLowerCase() === 'true';
}

function toNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function loadConfig() {
  return {
    appName: process.env.APP_NAME || 'WhatsApp SuperBot',
    env: process.env.NODE_ENV || 'development',
    prefix: process.env.BOT_PREFIX || '.',
    ownerPhone: (process.env.OWNER_PHONE || '').replace(/\D/g, ''),
    adminPhones: (process.env.ADMIN_PHONES || '')
      .split(',')
      .map((item) => item.replace(/\D/g, '').trim())
      .filter(Boolean),
    sessionPath: process.env.SESSION_PATH || path.join(process.cwd(), '.wwebjs_auth'),
    chromeExecutablePath: process.env.CHROME_EXECUTABLE_PATH || '',
    puppeteerTimeoutMs: toNumber(process.env.PUPPETEER_TIMEOUT_MS, 120000),
    maxMediaSizeMb: toNumber(process.env.MAX_MEDIA_SIZE_MB, 15),
    maxVideoDurationSeconds: toNumber(process.env.MAX_VIDEO_DURATION_SECONDS, 6),
    rateLimitWindowSeconds: toNumber(process.env.RATE_LIMIT_WINDOW_SECONDS, 30),
    rateLimitMaxCommands: toNumber(process.env.RATE_LIMIT_MAX_COMMANDS, 8),
    aiProvider: process.env.AI_PROVIDER || 'mock',
    aiApiKey: process.env.AI_API_KEY || '',
    aiPrimaryModel: process.env.AI_PRIMARY_MODEL || '',
    aiFallbackModel: process.env.AI_FALLBACK_MODEL || '',
    aiThirdModel: process.env.AI_THIRD_MODEL || '',
    aiFreeRouterModel: process.env.AI_FREE_ROUTER_MODEL || '',
    currencyApiKey: process.env.CURRENCY_API_KEY || '',
    weatherApiKey: process.env.WEATHER_API_KEY || '',
    lyricApiKey: process.env.LYRIC_API_KEY || '',
    qrisMerchantName: process.env.QRIS_MERCHANT_NAME || 'Antoniqueee',
    qrisMerchantCity: process.env.QRIS_MERCHANT_CITY || 'JAKARTA',
    qrisMerchantPhone: process.env.QRIS_MERCHANT_PHONE || '',
    databaseDriver: process.env.DATABASE_DRIVER || 'sqlite',
    databaseUrl: process.env.DATABASE_URL || 'file:./src/data/bot.sqlite',
    modules: {
      sticker: toBool(process.env.ENABLE_STICKER, true),
      downloader: toBool(process.env.ENABLE_DOWNLOADER, false),
      ai: toBool(process.env.ENABLE_AI, true),
      group: toBool(process.env.ENABLE_GROUP_TOOLS, true),
      games: toBool(process.env.ENABLE_GAMES, true),
      utility: toBool(process.env.ENABLE_UTILITY, true)
    }
  };
}

module.exports = { loadConfig };
