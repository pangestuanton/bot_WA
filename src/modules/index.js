const fs = require('fs');
const path = require('path');

async function loadPlugins({ config, logger }) {
  const baseDir = path.join(process.cwd(), 'src', 'modules');
  const categories = fs.existsSync(baseDir) ? fs.readdirSync(baseDir) : [];
  const plugins = [];
  const commands = new Map();

  for (const category of categories) {
    const categoryDir = path.join(baseDir, category);
    if (!fs.statSync(categoryDir).isDirectory()) {
      continue;
    }
    for (const file of fs.readdirSync(categoryDir)) {
      if (!file.endsWith('.js')) {
        continue;
      }
      const plugin = require(path.join(categoryDir, file));
      plugin.category = plugin.category || category;
      plugin.enabled = plugin.enabled !== false;
      if (config.modules[plugin.category] === false) {
        plugin.enabled = false;
      }
      plugins.push(plugin);
      for (const command of plugin.commands || []) {
        if (commands.has(command)) {
          throw new Error(`Command duplikat: ${command}`);
        }
        commands.set(command, plugin);
      }
    }
  }

  logger.info({ plugins: plugins.map((item) => item.name) }, 'Plugin dimuat');
  return { plugins, commands };
}

module.exports = { loadPlugins };
