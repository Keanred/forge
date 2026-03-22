#!/usr/bin/env node
import { Command } from 'commander';
import { initGit } from './post-scaffold.js';
import { resolvePath } from './scaffold.js';
import { validateProjectName } from './utils/validate.js';

const program = new Command();

const main = async () => {
  program.name('forge').description('A CLI tool for managing your Forge projects').version('1.0.0');

  program
    .command('init <projectName>')
    .description('Initialize a new Forge project')
    .action(async (projectName: string) => {
      await validateProjectName(projectName);
      await resolvePath(projectName);
      const path = (await import('node:path')).default;
      const destDir = path.resolve(process.cwd(), projectName);
      await initGit(destDir);
    });

  await program.parseAsync(process.argv);
};

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
