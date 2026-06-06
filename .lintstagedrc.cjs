const path = require('path');

const frontendRoot = path.join(__dirname, 'applications', 'frontend');
const backendRoot = path.join(__dirname, 'applications', 'backend');

function toRelative(root, files) {
  return files.map((file) => path.relative(root, file)).join(' ');
}

function isFrontendSrcLintTarget(file) {
  const normalized = file.replace(/\\/g, '/');
  return normalized.includes('applications/frontend/src/');
}

function isBackendSrcLintTarget(file) {
  const normalized = file.replace(/\\/g, '/');
  return normalized.includes('applications/backend/src/');
}

module.exports = {
  'applications/frontend/**/*.{ts,html}': (files) => {
    if (files.length === 0) {
      return [];
    }

    const relative = toRelative(frontendRoot, files);
    const commands = [`npm run format:files --prefix applications/frontend -- ${relative}`];

    const srcFiles = files.filter(isFrontendSrcLintTarget);
    if (srcFiles.length > 0) {
      commands.push(
        `npm run lint:files --prefix applications/frontend -- ${toRelative(frontendRoot, srcFiles)}`,
      );
    }

    return commands;
  },
  'applications/frontend/**/*.{scss,css}': (files) => {
    if (files.length === 0) {
      return [];
    }

    const relative = toRelative(frontendRoot, files);
    return [`npm run lint:styles:files --prefix applications/frontend -- ${relative}`];
  },
  'applications/backend/src/**/*.{ts,vue,js}': (files) => {
    if (files.length === 0) {
      return [];
    }

    const relative = toRelative(backendRoot, files);
    const commands = [`npm run format:files --prefix applications/backend -- ${relative}`];

    const srcFiles = files.filter(isBackendSrcLintTarget);
    if (srcFiles.length > 0) {
      commands.push(
        `npm run lint:files --prefix applications/backend -- ${toRelative(backendRoot, srcFiles)}`,
      );
    }

    return commands;
  },
};
