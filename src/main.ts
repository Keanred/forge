#!/usr/bin/env node
import { Command } from 'commander';
import path from 'node:path';
import { initGit } from './post-scaffold.js';
import { resolvePath } from './scaffold.js';
import { validateProjectName } from './utils/validate.js';
import { promptUser } from 'prompts.js';

const program = new Command();

const main = async () => {
  program.name('forge').description('A CLI tool for managing your Forge projects').version('1.0.0');

  program
    .command('init <projectName>')
    .description('Initialize a new Forge project')
    .option('--template <template>', 'Template to use')
    .option('--no-typescript', 'Disable typescript')
    .option('--testing', 'Include testing setup')
    .option('--pm <npm|yarn|pnpm', 'Which package manager to use')
    .option('--no-git', 'Disable version control')
    .option('--version <version>', 'Which version the project is')
    .action(async (projectName: string) => {
      await validateProjectName(projectName);
      await resolvePath(projectName);
      await promptUser(program.opts());
      const destDir = path.resolve(process.cwd(), projectName);
      initGit(destDir);
    });

  await program.parseAsync(process.argv);
};

main().catch((error) => {
  console.error('An error occurred:', error);
  process.exit(1);
});
