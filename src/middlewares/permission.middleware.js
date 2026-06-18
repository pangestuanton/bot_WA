function createPermissionMiddleware({ config, repositories }) {
  return async function permission(ctx, plugin) {
    const user = repositories.users.getOrCreate(ctx.sender, ctx.senderName);
    repositories.users.incrementCommand(ctx.sender);

    ctx.user = user;
    ctx.isOwner = ctx.sender === config.ownerPhone;
    ctx.isPremium = Boolean(user.isPremium);

    if (user.isBanned) {
      throw new Error('Akun kamu sedang dibatasi dari penggunaan bot.');
    }

    if (plugin.ownerOnly && !ctx.isOwner) {
      throw new Error('Command ini khusus owner.');
    }

    if (plugin.adminOnly && !ctx.isAdmin && !ctx.isOwner) {
      throw new Error('Command ini hanya untuk admin grup.');
    }

    if (plugin.groupOnly && !ctx.isGroup) {
      throw new Error('Command ini hanya bisa dipakai di grup.');
    }

    if (plugin.privateOnly && ctx.isGroup) {
      throw new Error('Command ini hanya bisa dipakai di chat pribadi.');
    }

    if (plugin.premiumOnly && !ctx.isPremium && !ctx.isOwner) {
      throw new Error('Fitur ini khusus premium.');
    }
  };
}

module.exports = { createPermissionMiddleware };
