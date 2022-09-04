import * as path from 'path';
import * as rimraf from 'rimraf';
import * as fse from 'fs-extra';

export const fakeDir = (feature: string) => path.resolve(__dirname, 'tmp', feature);
export const fakeSrcDir = (feature: string) => path.resolve(fakeDir(feature), 'src');

export const removeFakeDir = (feature: string): void => rimraf.sync(fakeDir(feature));

export const resetFakeDir = (feature: string): void => {
  removeFakeDir(feature);
  fse.ensureDirSync(fakeSrcDir(feature));
};
