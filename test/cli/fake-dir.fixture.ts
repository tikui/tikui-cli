import * as path from 'node:path';
import { rimrafSync } from 'rimraf';
import { ensureDirSync } from 'fs-extra/esm';

export const fakeDir = (feature: string) => path.resolve(import.meta.dirname, 'tmp', feature);
export const fakeSrcDir = (feature: string) => path.resolve(fakeDir(feature), 'src');

export const removeFakeDir = (feature: string) => rimrafSync(fakeDir(feature));

export const resetFakeDir = (feature: string): void => {
  removeFakeDir(feature);
  ensureDirSync(fakeSrcDir(feature));
};
