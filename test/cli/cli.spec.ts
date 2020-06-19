import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as fse from 'fs-extra';
import { createComponent } from '@/cli/cli';

const basePath = path.resolve(__dirname, 'tmp');

const expectAssetCreatedFor = (folderPath: string, componentName: string) => {
  expect(fs.statSync(path.resolve(__dirname, `${ folderPath }`)).isDirectory()).toBeTruthy();
  expect(fs.statSync(path.resolve(__dirname, `${ folderPath }/${ componentName }.md`)).isFile()).toBeTruthy();
  expect(fs.statSync(path.resolve(__dirname, `${ folderPath }/${ componentName }.render.pug`)).isFile()).toBeTruthy();
  expect(fs.statSync(path.resolve(__dirname, `${ folderPath }/${ componentName }.code.pug`)).isFile()).toBeTruthy();
  expect(fs.statSync(path.resolve(__dirname, `${ folderPath }/_${ componentName }.scss`)).isFile()).toBeTruthy();
};

describe('CLI tests', () => {
  beforeEach(() => {
    rimraf.sync(basePath);
    fse.ensureDirSync(path.resolve(basePath, 'src'));
  });

  afterAll(() => {
    rimraf.sync(basePath);
  });

  it('Should create directory component under src and its files', () => {
    // When
    createComponent(basePath, 'component');

    // Then
    expectAssetCreatedFor('tmp/src/component', 'component');
  });

  it('Should create directory component/sub-component under src and its files', () => {
    // When
    createComponent(basePath, 'component/sub-component');

    // Then
    expectAssetCreatedFor('tmp/src/component/sub-component', 'sub-component');
  });
});
