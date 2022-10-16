#!/usr/bin/env node

import 'module-alias/register';
import { program } from 'commander';
import { createComponent } from '@/cli/create-component';
import * as path from 'path';
import { generateProject } from '@/cli/generate-project';

try {
  program
    .command('create <component> [destination]')
    .option('-p, --prefix <name>', 'prefix')
    .option('--mo, --mixin-options', 'add options parameter to mixin')
    .description('create a component.')
    .addHelpText('after', '\nExample:\n $ tikui create -p tikui component src/atom')
    .action((component, destination, options) => {
      createComponent(destination, component, options.prefix, options.mixinOptions);
      console.log(`Creating component ${component} to ${path.resolve(destination)}`); // eslint-disable-line no-console
    });

  program
    .command('generate <project> [destination]')
    .description('generate a Tikui project')
    .addHelpText('after', '\nExample:\n $ tikui generate tikui')
    .action((project, destination = '.') => {
      generateProject(destination, project);
      console.log(`Generating project ${project} to ${path.resolve(destination)}`); // eslint-disable-line no-console
    });

  program.parse(process.argv);
} catch (e) {
  console.error(e.message); // eslint-disable-line no-console
  process.exit(1);
}
