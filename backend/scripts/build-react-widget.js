import esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../..');
const entryFile = path.join(projectRoot, 'components/react/AdminStatsWidget.jsx');
const outDir = path.join(projectRoot, 'assets');
const outFile = path.join(outDir, 'react-admin-widget.js');

fs.mkdirSync(outDir, { recursive: true });

await esbuild.build({
  entryPoints: [entryFile],
  outfile: outFile,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  sourcemap: false,
  logLevel: 'silent'
});

console.log('React admin widget built.');
