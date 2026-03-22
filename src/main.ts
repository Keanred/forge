#!/usr/bin/env node
import { Command } from 'commander';
import { initGit } from './post-scaffold.js';
import { resolvePath } from './scaffold.js';

const program = new Command();

const main = async () => {
  program.name('forge').description('A CLI tool for managing your Forge projects').version('1.0.0');

  program
    .command('init <projectName>')
    .description('Initialize a new Forge project')
    .action(async (projectName: string) => {
      await resolvePath(projectName);
      await initGit();
    });

  await program.parseAsync(process.argv);
};

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
