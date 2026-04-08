#!/usr/bin/env node
import { Command } from 'commander';
import path from 'node:path';
import { initGit } from './post-scaffold.js';
import { promptUser } from './prompts.js';
import { resolvePath } from './scaffold.js';
import { validateProjectName } from './utils/validate.js';

const program = new Command();

const main = async () => {
  program.name('forge').description('A CLI tool for managing your Forge projects').version('1.0.0');

  program
    .command('init')
    .description('Initialize a new Forge project')
    .option('--name <name>', 'Name of the project')
    .option('--template <template>', 'Template to use')
    .option('--no-typescript', 'Disable typescript')
    .option('--testing', 'Include testing setup')
    .option('--pm <npm|yarn|pnpm', 'Which package manager to use')
    .option('--no-git', 'Disable version control')
    .option('--version <version>', 'Which version the project is')
    .action(async (opts) => {
      const projectSettings = await promptUser(opts);
      await validateProjectName(projectSettings.name);
      await resolvePath(projectSettings);
      const destDir = path.resolve(process.cwd(), projectSettings.name);
      if (projectSettings.git) {
        initGit(destDir);
      }
    });

  await program.parseAsync(process.argv);
};

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
