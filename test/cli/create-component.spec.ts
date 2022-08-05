import * as fs from 'fs';
import * as path from 'path';
import { createComponent } from '@/cli/create-component';
import { FAKE_DIR, fakeSrcDir, removeFakeDir, resetFakeDir } from './fake-dir.fixture';

const pathTo = (folderPath: string) => (...segments: string[]): string => path.resolve(FAKE_DIR, `${folderPath}`, ...segments);

const expectAssetCreatedFor = (base: string) => (folderPath: string, componentName: string) => {
  const pathFolderTo = pathTo(path.join(base, folderPath));
  const pathStatSyncTo = (...segments: string[]) => fs.statSync(pathFolderTo(...segments));
  const expectFile = (filename: string) => expect(pathStatSyncTo(filename).isFile()).toBe(true);

  expect(pathStatSyncTo().isDirectory()).toBe(true);
  expectFile(`${componentName}.md`);
  expectFile(`${componentName}.render.pug`);
  expectFile(`${componentName}.mixin.pug`);
  expectFile(`${componentName}.code.pug`);
  expectFile(`_${componentName}.scss`);
};

const componentFiles = (base: string) =>(name = 'component') => ({
  documentation: fs.readFileSync(path.resolve(fakeSrcDir(base), `${name}/${name}.md`), 'utf8').toString(),
  mixin: fs.readFileSync(path.resolve(fakeSrcDir(base), `${name}/${name}.mixin.pug`), 'utf8').toString(),
  render: fs.readFileSync(path.resolve(fakeSrcDir(base), `${name}/${name}.render.pug`), 'utf8').toString(),
  style: fs.readFileSync(path.resolve(fakeSrcDir(base), `${name}/_${name}.scss`), 'utf8').toString(),
});

const componentWithSeparatedNameFiles = (base: string) => ({
  documentation: fs.readFileSync(path.resolve(fakeSrcDir(base), 'component-with-separated-name/component-with-separated-name.md'), 'utf8').toString(),
  mixin: fs.readFileSync(path.resolve(fakeSrcDir(base), 'component-with-separated-name/component-with-separated-name.mixin.pug'), 'utf8').toString(),
  render: fs.readFileSync(path.resolve(fakeSrcDir(base), 'component-with-separated-name/component-with-separated-name.render.pug'), 'utf8').toString(),
  style: fs.readFileSync(path.resolve(fakeSrcDir(base), 'component-with-separated-name/_component-with-separated-name.scss'), 'utf8').toString(),
});

const SUITE_BASE = 'create';

describe('CLI tests', () => {
  it('Should create directory component under src and its files', () => {
    const base = `${SUITE_BASE}-component`;
    resetFakeDir(base);

    createComponent(fakeSrcDir(base), 'component');

    expectAssetCreatedFor(base)('src/component', 'component');

    removeFakeDir(base);
  });

  it('Should create directory component/sub-component under src and its files', () => {
    const base = `${SUITE_BASE}-sub-component`;
    resetFakeDir(base);

    createComponent(path.resolve(fakeSrcDir(base), 'component'), 'sub-component');

    expectAssetCreatedFor(base)('src/component/sub-component', 'sub-component');

    removeFakeDir(base);
  });

  it('Should have component content', () => {
    const base = `${SUITE_BASE}-content`;
    resetFakeDir(base);

    createComponent(fakeSrcDir(base), 'component');

    const { documentation, mixin, render, style } = componentFiles(base)();
    expect(documentation).toBe('## Component\n');
    expect(mixin).toBe('mixin component\n  .component component\n');
    expect(render).toBe('extends /layout\n\nblock body\n  include component.code.pug\n');
    expect(style).toBe('.component {\n  // component code\n}\n');

    removeFakeDir(base);
  });

  it('Should have component content for one letter component', () => {
    const base = `${SUITE_BASE}-one-letter`;
    resetFakeDir(base);

    createComponent(fakeSrcDir(base), 'c');

    // Then
    const { documentation, mixin, render, style } = componentFiles(base)('c');
    expect(documentation).toBe('## C\n');
    expect(mixin).toBe('mixin c\n  .c c\n');
    expect(render).toBe('extends /layout\n\nblock body\n  include c.code.pug\n');
    expect(style).toBe('.c {\n  // c code\n}\n');

    removeFakeDir(base);
  });

  it('Should have expected content for dash separated component name', () => {
    const base = `${SUITE_BASE}-dash`;
    resetFakeDir(base);

    createComponent(fakeSrcDir(base), 'component-with-separated-name');

    const { documentation, mixin, render, style } = componentWithSeparatedNameFiles(base);
    expect(documentation).toBe('## Component with separated name\n');
    expect(mixin).toBe('mixin component-with-separated-name\n  .component-with-separated-name component-with-separated-name\n');
    expect(render).toBe('extends /layout\n\nblock body\n  include component-with-separated-name.code.pug\n');
    expect(style).toBe('.component-with-separated-name {\n  // component-with-separated-name code\n}\n');

    removeFakeDir(base);
  });

  it('Should style manage prefix component class', () => {
    const base = `${SUITE_BASE}-prefix`;
    resetFakeDir(base);

    createComponent(fakeSrcDir(base), 'component', 'prefix');

    const { documentation, mixin, render, style } = componentFiles(base)();
    expect(documentation).toBe('## Component\n');
    expect(mixin).toBe('mixin prefix-component\n  .prefix-component component\n');
    expect(render).toBe('extends /layout\n\nblock body\n  include component.code.pug\n');
    expect(style).toBe('.prefix-component {\n  // component code\n}\n');

    removeFakeDir(base);
  });

  it('Should create when component name has lower alphabetic separated by optional dash characters', () => {
    const base = `${SUITE_BASE}-lower`;
    resetFakeDir(base);

    expect(() => createComponent(fakeSrcDir(base), 'UPPERCASE'))
      .toThrow('The component should have alphabetic characters separated by dashes: "U" at position 1 is not allowed');
    expect(() => createComponent(fakeSrcDir(base), '-begin')).toThrow('The component should have alphabetic characters separated by dashes: "-" at position 1 is not allowed');
    expect(() => createComponent(fakeSrcDir(base), 'end-')).toThrow('The component should have alphabetic characters separated by dashes: "-" at position 4 is not allowed');
    expect(() => createComponent(fakeSrcDir(base), '')).toThrow('Component name should not be empty');
    expect(() => createComponent(fakeSrcDir(base), 'a-long-component')).not.toThrow();

    removeFakeDir(base);
  });

  it('Should create when prefix has lower alphabetic separated by optional dash characters', () => {
    const base = `${SUITE_BASE}-lower-prefix`;
    resetFakeDir(base);
    expect(() => createComponent(fakeSrcDir(base), 'component', 'UPPERCASE'))
      .toThrow('The prefix should have alphabetic characters separated by dashes: "U" at position 1 is not allowed');
    expect(() => createComponent(fakeSrcDir(base), 'component', '-begin'))
      .toThrow('The prefix should have alphabetic characters separated by dashes: "-" at position 1 is not allowed');
    expect(() => createComponent(fakeSrcDir(base), 'component', 'end-'))
      .toThrow('The prefix should have alphabetic characters separated by dashes: "-" at position 4 is not allowed');
    expect(() => createComponent(fakeSrcDir(base), 'a-long-component')).not.toThrow();

    removeFakeDir(base);
  });
});
