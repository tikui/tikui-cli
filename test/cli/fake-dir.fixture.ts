import * as path from 'path';
import * as rimraf from 'rimraf';
import * as fse from 'fs-extra';

export const FAKE_DIR = path.resolve(__dirname, 'tmp');
export const FAKE_SRC_DIR = path.resolve(FAKE_DIR, 'src');

export const removeFakeDir = (): void => rimraf.sync(FAKE_DIR);

export const resetFakeDir = (): void => {
  removeFakeDir();
  fse.ensureDirSync(FAKE_SRC_DIR);
};
