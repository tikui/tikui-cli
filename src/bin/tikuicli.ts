#!/usr/bin/env node

import 'module-alias/register';
import { program } from 'commander';
import { createComponent } from '@/cli/create-component';
import * as path from 'path';

try {
  program
    .command('create <component> [destination]')
    .option('-p, --prefix <name>', 'prefix')
    .description('create a component')
    .action((component, destination, options) => {
      createComponent(destination, component, options.prefix);
      console.log(`Creating component ${component} to ${path.resolve(destination)}`); // eslint-disable-line no-console
    });

  program.parse(process.argv);
} catch (e) {
  console.error(e.message); // eslint-disable-line no-console
  process.exit(1);
}

