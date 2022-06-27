import * as fs from 'fs';
import * as path from 'path';
import { FAKE_DIR, removeFakeDir, resetFakeDir } from './fake-dir.fixture';
import { generateProject } from '@/cli/generate-project';

const pathTo = (folderPath: string) => (...segments: string[]): string => path.resolve(FAKE_DIR, `${folderPath}`, ...segments);

const GENERATE_PROJECT_PATH = path.resolve(__dirname, '../../src/cli/generate-project');

const expectAssetCreatedFor = (name: string) => {
  const pathFolderTo = pathTo(name);
  const pathReadSyncTo = (...segments: string[]) => fs.readFileSync(pathFolderTo(...segments));
  const expectSameFile = (category: string) => (filePath: string) =>
    expect(pathReadSyncTo(filePath).toString()).toBe(fs.readFileSync(path.resolve(GENERATE_PROJECT_PATH, category, filePath)).toString());
  const expectSameBinaryFile = (category: string) => (filePath: string) =>
    expect(pathReadSyncTo(filePath)).toStrictEqual(fs.readFileSync(path.resolve(GENERATE_PROJECT_PATH, category, filePath)));
  const expectPackageJson = (): void => {
    const filename = 'package.json';
    const original = JSON.parse(fs.readFileSync(path.resolve(GENERATE_PROJECT_PATH, 'templated', filename)).toString());
    const packageJson = fs.readFileSync(pathFolderTo(filename)).toString();
    const json = JSON.parse(packageJson);

    expect(packageJson).toMatch(/\n$/);
    expect(json.dependencies).toEqual(original.dependencies);
    expect(json.scripts).toEqual(original.scripts);
    expect(json.devDependencies).toEqual(original.devDependencies);
    expect(json.name).toBe(name);
  };

  ['src/favicon.ico'].forEach(expectSameBinaryFile('common'));
  [
    '.editorconfig',
    '.gitignore',
    '.pug-lintrc.json',
    '.stylelintrc.json',
    'logo.svg',
    'README.md',
    'tikuiconfig.json',
    'tsconfig.json',
    'src/tikui.scss',
    'src/layout.pug',
  ].forEach(expectSameFile('common'));
  [
    'src/index.pug',
    'src/layout-documentation.pug',
    'src/atom/atom.pug',
    'src/molecule/molecule.pug',
    'src/template/template.pug',
  ].forEach(expectSameFile('atomic'));

  expectPackageJson();
};

describe('CLI tests', () => {
  beforeEach(() => resetFakeDir());

  afterAll(() => removeFakeDir());

  it.each(['project', 'my-awesome_project2'])('Should create project under project name directory and its files for %s', (name) => {
    generateProject(FAKE_DIR, name);

    expectAssetCreatedFor(name);
  });

  it.each([
    { name: ' project  ', normalized: 'project' },
    { name: '\nother\r\t', normalized: 'other' },
  ])('Should normalize for $normalized', ({ name, normalized }) => {
    generateProject(FAKE_DIR, name);

    expectAssetCreatedFor(normalized);
  });

  it('Should not have an empty name', () => {
    expect(() => generateProject(FAKE_DIR, ' ')).toThrow('The project name should not be empty');
  });

  it.each(['bad name', 'é', 'BadName'])('Should not generate for bad name %s', (name) =>
    expect(() =>
      generateProject(FAKE_DIR, name)
    ).toThrow(`The project name "${name}" is not valid, it should be composed by lowercase alphanumeric, dash or underscore characters`)
  );
});
