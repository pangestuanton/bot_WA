const LINE = '--------------------------------';

function title(text) {
  return [
    LINE,
    `*${String(text).toUpperCase()}*`,
    LINE
  ].join('\n');
}

function section(label, rows = []) {
  const body = rows.filter(Boolean).join('\n');
  return [`*${label}*`, body].filter(Boolean).join('\n');
}

function keyValue(label, value) {
  return `> ${label}: *${value}*`;
}

function commandList(commands, maxPerLine = 2) {
  const rows = [];
  for (let i = 0; i < commands.length; i += maxPerLine) {
    rows.push(commands.slice(i, i + maxPerLine).map((command) => `\`${command}\``).join('   '));
  }
  return rows.join('\n');
}

function footer(lines = []) {
  return [
    LINE,
    ...lines.map((line) => `> ${line}`)
  ].join('\n');
}

module.exports = {
  LINE,
  title,
  section,
  keyValue,
  commandList,
  footer
};
