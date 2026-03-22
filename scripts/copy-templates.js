// scripts/copy-templates.js
import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(__dirname, '../src/templates');
const dest = path.join(__dirname, '../dist/templates');

fs.copySync(src, dest);
console.log('Templates copied from src/templates to dist/templates');
