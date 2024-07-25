import * as path from 'path';
import * as fse from 'fs-extra';
import * as fs from 'fs';

const createFile = (folderPath: string, filename: string): void =>
  fse.ensureFileSync(path.resolve(folderPath, filename));

const dashPrefix = (prefix?: string) => (prefix === undefined ? '' : `${prefix}-`);

const createDocumentation = (componentDirectory: string, component: string): void => {
  const content = `## ${createDocumentationTitle(component)}\n`;
  const file = `${component}.md`;
  createFile(componentDirectory, file);
  fs.writeFileSync(path.resolve(componentDirectory, file), content);
};

const createDocumentationTitle = (component: string): string => {
  const componentNameWithoutDash = component.split('-').join(' ');
  return capitalize(componentNameWithoutDash);
};

const capitalize = (sentence: string): string =>
  sentence.length > 1
    ? sentence.charAt(0).toUpperCase() + sentence.slice(1)
    : sentence.toUpperCase();

const createMixin = (componentDirectory: string, component: string, prefix?: string): void => {
  const content = `mixin ${dashPrefix(prefix)}${component}\n  .${dashPrefix(prefix)}${component} ${component}\n`;
  const file = `${component}.mixin.pug`;
  createFile(componentDirectory, file);
  fs.writeFileSync(path.resolve(componentDirectory, file), content);
};

const createCode = (componentDirectory: string, component: string, prefix?: string): void => {
  const content = `include ${component}.mixin.pug\n\n+${dashPrefix(prefix)}${component}\n`;
  const file = `${component}.code.pug`;
  createFile(componentDirectory, file);
  fs.writeFileSync(path.resolve(componentDirectory, file), content);
};

const createRender = (componentDirectory: string, component: string): void => {
  const content = `extends /layout\n\nblock body\n  include ${component}.code.pug\n`;
  const file = `${component}.render.pug`;
  createFile(componentDirectory, file);
  fs.writeFileSync(path.resolve(componentDirectory, file), content);
};

const createStyle = (componentDirectory: string, component: string, prefix?: string): void => {
  const content = `.${dashPrefix(prefix)}${component} {\n  // ${component} code\n}\n`;
  const file = `_${component}.scss`;
  createFile(componentDirectory, file);
  fs.writeFileSync(path.resolve(componentDirectory, file), content);
};

const throwNameError =
  (type: string) =>
  (character: string, position: number): void => {
    throw new Error(
      `The ${type} should have alphabetic characters separated by dashes: "${character}" at position ${position} is not allowed`,
    );
  };

const assertForNameCharacter = (type: string) => (character: string, position: number) => {
  if (character.match(/[a-z-]/) === null) {
    throwNameError(type)(character, position);
  }
};

const assertForName = (type: string) => (name: string) => {
  const lastPosition = name.length;
  const throwNamedError = throwNameError(type);
  const assertForNamedCharacter = assertForNameCharacter(type);

  name.split('').forEach((character, index) => {
    const position = index + 1;
    assertForNamedCharacter(character, position);
  });

  if (name.charAt(0) === '-') {
    throwNamedError(name.charAt(0), 1);
  }

  if (name.charAt(lastPosition - 1) === '-') {
    throwNamedError(name.charAt(lastPosition - 1), lastPosition);
  }
};

const assertForPrefix = (prefix: string) => {
  if (prefix === undefined) {
    return;
  }
  assertForName('prefix')(prefix);
};

const assertForComponentName = (componentName: string) => {
  assertForName('component')(componentName);

  if (componentName === '') {
    throw new Error('Component name should not be empty');
  }
};

export const createComponent = (basePath: string, component: string, prefix?: string): void => {
  assertForComponentName(component);
  assertForPrefix(prefix);

  const componentDirectory = path.resolve(basePath, component);
  createDocumentation(componentDirectory, component);
  createMixin(componentDirectory, component, prefix);
  createCode(componentDirectory, component, prefix);
  createRender(componentDirectory, component);
  createStyle(componentDirectory, component, prefix);
};
