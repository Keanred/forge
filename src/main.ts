#!/usr/bin/env node
import { Command } from 'commander';

const program = new Command();

program.name('forge').description('A CLI tool for managing your Forge projects').version('1.0.0');

program
  .command('init')
  .description('Initialize a new Forge project')
  .action(() => {
    console.log('Initializing a new Forge project...');
  });
