import * as path from 'path';
import * as rimraf from 'rimraf';
import * as fse from 'fs-extra';

export const FAKE_DIR = path.resolve(__dirname, 'tmp');

export const fakeDir = (name: string): string => path.resolve(FAKE_DIR, name);
export const fakeSrcDir = (name: string): string => path.resolve(fakeDir(name), 'src');

export const removeFakeDir = (name: string): void => rimraf.sync(fakeDir(name));

export const resetFakeDir = (name: string): void => {
  removeFakeDir(name);
  fse.ensureDirSync(fakeDir(name));
};
