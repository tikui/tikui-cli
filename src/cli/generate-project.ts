import * as fse from 'fs-extra';
import * as path from 'path';
import * as fs from 'fs';

const copyFromCategory = (...categories: string[]) => (basePath: string, name: string): void =>
  categories.forEach(category => fse.copySync(path.resolve(__dirname, `generate-project/${category}`), path.resolve(basePath, name)));

const copyTemplate = (name: string, basePath: string): void => {
  const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'generate-project/templated/package.json')).toString());
  const packageJsonWithName = JSON.stringify({
    ...packageJson,
    name,
  }, null, 2).concat('\n');
  fs.writeFileSync(path.resolve(basePath, name, 'package.json'), packageJsonWithName);
};

const assertForName = (name: string) => {
  if(!/^[a-z\d\-_]+$/.test(name)) {
    throw new Error(`The project name "${name}" is not valid, it should be composed by lowercase alphanumeric, dash or underscore characters`);
  }
};

const assertNotEmpty = (name: string): void => {
  if (name.length === 0) {
    throw new Error('The project name should not be empty');
  }
};

export const generateProject = (basePath: string, name: string): void => {
  const normalizedName = name.trim();
  assertNotEmpty(normalizedName);
  assertForName(normalizedName);
  copyFromCategory('common', 'atomic')(basePath, normalizedName);
  copyTemplate(normalizedName, basePath);
};

