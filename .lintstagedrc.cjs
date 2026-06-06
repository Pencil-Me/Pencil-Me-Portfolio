const path = require('path');

const frontendRoot = path.join(__dirname, 'applications', 'frontend');

function toRelative(files) {
  return files.map((file) => path.relative(frontendRoot, file)).join(' ');
}

function isSrcLintTarget(file) {
  const normalized = file.replace(/\\/g, '/');
  return normalized.includes('applications/frontend/src/');
}

module.exports = {
  'applications/frontend/**/*.{ts,html}': (files) => {
    if (files.length === 0) {
      return [];
    }

    const relative = toRelative(files);
    const commands = [`npm run format:files --prefix applications/frontend -- ${relative}`];

    const srcFiles = files.filter(isSrcLintTarget);
    if (srcFiles.length > 0) {
      commands.push(
        `npm run lint:files --prefix applications/frontend -- ${toRelative(srcFiles)}`,
      );
    }

    return commands;
  },
  'applications/frontend/**/*.{scss,css}': (files) => {
    if (files.length === 0) {
      return [];
    }

    const relative = toRelative(files);
    return [`npm run lint:styles:files --prefix applications/frontend -- ${relative}`];
  },
};
