function createSafetyMiddleware() {
  return async function safety(ctx) {
    const text = `${ctx.command} ${ctx.args.join(' ')}`.toLowerCase();
    const blocked = ['phishing', 'drm bypass', 'spam massal'];
    if (blocked.some((item) => text.includes(item))) {
      throw new Error('Permintaan ini tidak bisa diproses.');
    }
  };
}

module.exports = { createSafetyMiddleware };
