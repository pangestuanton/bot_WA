const dayjs = require('dayjs');
const { nanoid } = require('nanoid');

function now() {
  return dayjs().toISOString();
}

function createMemoryStore() {
  return {
    users: new Map(),
    groups: new Map(),
    groupSettings: new Map(),
    commandLogs: [],
    warnings: new Map(),
    gameScores: new Map(),
    gameSessions: new Map(),
    aiUsage: []
  };
}

function createRepositories({ config, logger }) {
  const store = createMemoryStore();

  const users = {
    getOrCreate(phone, name = 'Pengguna') {
      if (!store.users.has(phone)) {
        store.users.set(phone, {
          id: nanoid(),
          phone,
          name,
          role: phone === config.ownerPhone ? 'owner' : 'user',
          isPremium: false,
          isBanned: false,
          commandCount: 0,
          createdAt: now(),
          updatedAt: now()
        });
      }
      const user = store.users.get(phone);
      user.name = name || user.name;
      user.updatedAt = now();
      return user;
    },
    incrementCommand(phone) {
      const user = this.getOrCreate(phone);
      user.commandCount += 1;
      user.updatedAt = now();
      return user;
    }
  };

  const groups = {
    getOrCreate(groupJid, name = 'Grup') {
      if (!store.groups.has(groupJid)) {
        const group = { id: nanoid(), groupJid, name, isActive: true, createdAt: now(), updatedAt: now() };
        store.groups.set(groupJid, group);
        store.groupSettings.set(groupJid, {
          id: nanoid(),
          groupId: group.id,
          welcomeEnabled: false,
          goodbyeEnabled: false,
          antilinkEnabled: false,
          antilinkAction: 'warn',
          maxWarning: 3,
          tagallEnabled: true,
          rules: '1. Sopan\n2. Tidak spam\n3. Tidak kirim link mencurigakan\n4. Hormati anggota lain',
          createdAt: now(),
          updatedAt: now()
        });
      }
      const group = store.groups.get(groupJid);
      group.name = name || group.name;
      group.updatedAt = now();
      return group;
    },
    getSettings(groupJid) {
      this.getOrCreate(groupJid);
      return store.groupSettings.get(groupJid);
    },
    updateSettings(groupJid, patch) {
      const settings = this.getSettings(groupJid);
      Object.assign(settings, patch, { updatedAt: now() });
      return settings;
    }
  };

  const logs = {
    create(payload) {
      store.commandLogs.push({ id: nanoid(), createdAt: now(), ...payload });
    },
    recent(limit = 10) {
      return store.commandLogs.slice(-limit).reverse();
    }
  };

  const warnings = {
    add(groupJid, userPhone, reason) {
      const key = `${groupJid}:${userPhone}`;
      const current = store.warnings.get(key) || { id: nanoid(), groupJid, userPhone, warningCount: 0, reason, createdAt: now(), updatedAt: now() };
      current.warningCount += 1;
      current.reason = reason;
      current.updatedAt = now();
      store.warnings.set(key, current);
      return current;
    },
    clear(groupJid, userPhone) {
      store.warnings.delete(`${groupJid}:${userPhone}`);
    }
  };

  const games = {
    getScore(userPhone, gameType = 'global') {
      const key = `${userPhone}:${gameType}`;
      if (!store.gameScores.has(key)) {
        store.gameScores.set(key, { id: nanoid(), userPhone, gameType, score: 0, winCount: 0, createdAt: now(), updatedAt: now() });
      }
      return store.gameScores.get(key);
    },
    addScore(userPhone, gameType, score) {
      const item = this.getScore(userPhone, gameType);
      item.score += score;
      item.winCount += 1;
      item.updatedAt = now();
      return item;
    },
    top(gameType = 'global', limit = 10) {
      return [...store.gameScores.values()]
        .filter((item) => item.gameType === gameType)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    },
    createSession(scopeId, payload) {
      store.gameSessions.set(scopeId, { id: nanoid(), scopeId, status: 'active', createdAt: now(), updatedAt: now(), ...payload });
      return store.gameSessions.get(scopeId);
    },
    findActiveSession(scopeId) {
      const session = store.gameSessions.get(scopeId);
      if (!session || session.status !== 'active') {
        return null;
      }
      return session;
    },
    finishSession(scopeId, winnerPhone) {
      const session = store.gameSessions.get(scopeId);
      if (!session) {
        return null;
      }
      session.status = 'finished';
      session.winnerPhone = winnerPhone;
      session.updatedAt = now();
      return session;
    }
  };

  const aiUsage = {
    add(payload) {
      store.aiUsage.push({ id: nanoid(), createdAt: now(), ...payload });
    }
  };

  return { store, users, groups, logs, warnings, games, aiUsage, findActiveSession: games.findActiveSession.bind(games) };
}

module.exports = { createRepositories };
