function createRateLimitMiddleware({ config }) {
  const cooldownState = new Map();
  const usageState = new Map();

  return async function rateLimit(ctx, plugin) {
    const now = Date.now();
    const cooldownKey = `${ctx.sender}:${plugin.name}`;
    const cooldownSeconds = plugin.cooldown || 0;
    const cooldownItem = cooldownState.get(cooldownKey);

    if (cooldownItem && now < cooldownItem.expiresAt) {
      const wait = Math.ceil((cooldownItem.expiresAt - now) / 1000);
      throw new Error(`Tunggu ${wait} detik sebelum memakai fitur ini lagi ya.`);
    }

    const usageKey = ctx.sender;
    const windowMs = config.rateLimitWindowSeconds * 1000;
    const usageItem = usageState.get(usageKey);

    if (!usageItem || now >= usageItem.resetAt) {
      usageState.set(usageKey, {
        count: 1,
        resetAt: now + windowMs
      });
    } else {
      if (usageItem.count >= config.rateLimitMaxCommands) {
        throw new Error(`Batas penggunaan tercapai. Coba lagi dalam ${Math.ceil((usageItem.resetAt - now) / 1000)} detik.`);
      }
      usageItem.count += 1;
    }

    cooldownState.set(cooldownKey, { expiresAt: now + cooldownSeconds * 1000 });
  };
}

module.exports = { createRateLimitMiddleware };
