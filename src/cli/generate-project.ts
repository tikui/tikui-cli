import * as fse from 'fs-extra';
import * as path from 'path';
import * as fs from 'fs';

const copyFromCategory = (...categories: string[]) => (basePath: string, name: string): void =>
  categories.forEach(category => fse.copySync(path.resolve(__dirname, `generate-project/${category}`), path.resolve(basePath, name)));

const templateSourcePath = (filePath: string): string => path.resolve(__dirname, 'generate-project/templated', filePath);

const copyPackageJson = (name: string, basePath: string) => {
  const packageJson = JSON.parse(fs.readFileSync(templateSourcePath('package.json')).toString());
  const packageJsonWithName = JSON.stringify({
    ...packageJson,
    name,
  }, null, 2).concat('\n');
  fs.writeFileSync(path.resolve(basePath, name, 'package.json'), packageJsonWithName);
};

const copyGitignore = (basePath: string, name: string): void => {
  fs.copyFileSync(
    templateSourcePath('gitignore'),
    path.resolve(basePath, name, '.gitignore'),
  );
};

const copyTemplate = (name: string, basePath: string): void => {
  copyPackageJson(name, basePath);
  copyGitignore(basePath, name);
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

