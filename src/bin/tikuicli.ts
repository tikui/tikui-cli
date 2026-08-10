#!/usr/bin/env node

import { program } from 'commander';
import * as path from 'node:path';
import * as process from 'node:process';
import { createComponent } from '../cli/create-component.js';
import { generateProject } from '../cli/generate-project.js';
import packageJson from './package.json' with { type: 'json' };

try {
  program
    .command('create <component> [destination]')
    .option('-p, --prefix <name>', 'prefix')
    .description('create a component.')
    .addHelpText('after', '\nExample:\n $ tikui create -p tikui component src/atom')
    .action((component, destination, options) => {
      createComponent(destination, component, options.prefix);
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

  program.version(packageJson.version, '-v, --version', 'current version');

  program.parse(process.argv);
} catch (e) {
  console.error(e instanceof Error ? e.message : e); // eslint-disable-line no-console
  process.exit(1);
}
