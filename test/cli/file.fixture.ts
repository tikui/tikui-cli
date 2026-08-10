import * as fs from 'node:fs';
import { expect } from 'vitest';

export type ExpectSame = (actualPath: string, expectedPath: string) => void;

export const expectSameTextFile: ExpectSame = (actualPath, expectedPath): void => {
  const actual = fs.readFileSync(actualPath);
  const expected = fs.readFileSync(expectedPath);

  expect(actual.toString()).toBe(expected.toString());
};

export const expectSameBinaryFile: ExpectSame = (actualPath, expectedPath): void => {
  const actual = fs.readFileSync(actualPath);
  const expected = fs.readFileSync(expectedPath);

  expect(actual).toStrictEqual(expected);
};
