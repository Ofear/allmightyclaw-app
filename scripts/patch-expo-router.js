const fs = require('fs');
const path = require('path');

const possiblePaths = [
  path.join(__dirname, '../packages/app/node_modules/expo-router/_ctx.web.js'),
  path.join(__dirname, '../node_modules/expo-router/_ctx.web.js'),
];

const ctxWebContent = `"use strict";
const ctx = require.context(
  "../../packages/app/app",
  true,
  /^(?:\\.\\/)(?!(?:(?:(?:.*\\+api)|(?:\\+middleware)|(?:\\+(html|native-intent))))\\.[tj]sx?$).*(?:\\.android|\\.ios|\\.native)?\\.[tj]sx?$/,
  "sync"
);
exports.ctx = ctx;
`;

const ctxHtmlContent = `"use strict";
const ctx = require.context(
  "../../packages/app/app",
  false,
  /\\+html\\.[tj]sx?$/,
  'sync'
);
exports.ctx = ctx;
`;

const ctxContent = `"use strict";
const ctx = require.context(
  "../../packages/app/app",
  true,
  /^(?:\\.\\/)(?!(?:(?:(?:.*\\+api)|(?:\\+html)))\\.[tj]sx?$).*\\.[tj]sx?$/
);
exports.ctx = ctx;
`;

function patchFile(fileName, content) {
  const possibleFiles = [
    path.join(__dirname, '../packages/app/node_modules/expo-router', fileName),
    path.join(__dirname, '../node_modules/expo-router', fileName),
  ];
  
  for (const filePath of possibleFiles) {
    try {
      if (fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Patched: ${filePath}`);
        return true;
      }
    } catch (err) {
      console.error(`Error patching ${filePath}:`, err.message);
    }
  }
  console.log(`File not found: ${fileName}`);
  return false;
}

console.log('Patching expo-router _ctx files...');
patchFile('_ctx.web.js', ctxWebContent);
patchFile('_ctx-html.js', ctxHtmlContent);
patchFile('_ctx.js', ctxContent);
console.log('Done patching expo-router _ctx files');
