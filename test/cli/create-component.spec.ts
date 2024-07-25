import * as fs from 'fs';
import * as path from 'path';
import { createComponent } from '@/cli/create-component';
import { fakeDir, fakeSrcDir, removeFakeDir, resetFakeDir } from './fake-dir.fixture';

const FEATURE = 'create-component';

const FAKE_DIR = fakeDir(FEATURE);
const FAKE_SRC_DIR = fakeSrcDir(FEATURE);

const pathTo =
  (folderPath: string) =>
  (...segments: string[]): string =>
    path.resolve(FAKE_DIR, `${folderPath}`, ...segments);

const expectAssetCreatedFor = (folderPath: string, componentName: string) => {
  const pathFolderTo = pathTo(folderPath);
  const pathStatSyncTo = (...segments: string[]) => fs.statSync(pathFolderTo(...segments));
  const expectFile = (filename: string) => expect(pathStatSyncTo(filename).isFile()).toBe(true);

  expect(pathStatSyncTo().isDirectory()).toBe(true);
  expectFile(`${componentName}.md`);
  expectFile(`${componentName}.render.pug`);
  expectFile(`${componentName}.mixin.pug`);
  expectFile(`${componentName}.code.pug`);
  expectFile(`_${componentName}.scss`);
};

const componentFiles = (name = 'component') => ({
  documentation: fs
    .readFileSync(path.resolve(FAKE_SRC_DIR, `${name}/${name}.md`), 'utf8')
    .toString(),
  mixin: fs
    .readFileSync(path.resolve(FAKE_SRC_DIR, `${name}/${name}.mixin.pug`), 'utf8')
    .toString(),
  render: fs
    .readFileSync(path.resolve(FAKE_SRC_DIR, `${name}/${name}.render.pug`), 'utf8')
    .toString(),
  style: fs.readFileSync(path.resolve(FAKE_SRC_DIR, `${name}/_${name}.scss`), 'utf8').toString(),
});

const componentWithSeparatedNameFiles = () => ({
  documentation: fs
    .readFileSync(
      path.resolve(FAKE_SRC_DIR, 'component-with-separated-name/component-with-separated-name.md'),
      'utf8',
    )
    .toString(),
  mixin: fs
    .readFileSync(
      path.resolve(
        FAKE_SRC_DIR,
        'component-with-separated-name/component-with-separated-name.mixin.pug',
      ),
      'utf8',
    )
    .toString(),
  render: fs
    .readFileSync(
      path.resolve(
        FAKE_SRC_DIR,
        'component-with-separated-name/component-with-separated-name.render.pug',
      ),
      'utf8',
    )
    .toString(),
  style: fs
    .readFileSync(
      path.resolve(
        FAKE_SRC_DIR,
        'component-with-separated-name/_component-with-separated-name.scss',
      ),
      'utf8',
    )
    .toString(),
});

describe('CLI tests', () => {
  beforeEach(() => resetFakeDir(FEATURE));

  afterAll(() => removeFakeDir(FEATURE));

  it('Should create directory component under src and its files', () => {
    // When
    createComponent(FAKE_SRC_DIR, 'component');

    // Then
    expectAssetCreatedFor('src/component', 'component');
  });

  it('Should create directory component/sub-component under src and its files', () => {
    // When
    createComponent(path.resolve(FAKE_SRC_DIR, 'component'), 'sub-component');

    // Then
    expectAssetCreatedFor('src/component/sub-component', 'sub-component');
  });

  it('Should have component content', () => {
    // When
    createComponent(FAKE_SRC_DIR, 'component');

    // Then
    const { documentation, mixin, render, style } = componentFiles();
    expect(documentation).toBe('## Component\n');
    expect(mixin).toBe('mixin component\n  .component component\n');
    expect(render).toBe('extends /layout\n\nblock body\n  include component.code.pug\n');
    expect(style).toBe('.component {\n  // component code\n}\n');
  });

  it('Should have component content for one letter component', () => {
    // When
    createComponent(FAKE_SRC_DIR, 'c');

    // Then
    const { documentation, mixin, render, style } = componentFiles('c');
    expect(documentation).toBe('## C\n');
    expect(mixin).toBe('mixin c\n  .c c\n');
    expect(render).toBe('extends /layout\n\nblock body\n  include c.code.pug\n');
    expect(style).toBe('.c {\n  // c code\n}\n');
  });

  it('Should have expected content for dash separated component name', () => {
    // When
    createComponent(FAKE_SRC_DIR, 'component-with-separated-name');

    // Then
    const { documentation, mixin, render, style } = componentWithSeparatedNameFiles();
    expect(documentation).toBe('## Component with separated name\n');
    expect(mixin).toBe(
      'mixin component-with-separated-name\n  .component-with-separated-name component-with-separated-name\n',
    );
    expect(render).toBe(
      'extends /layout\n\nblock body\n  include component-with-separated-name.code.pug\n',
    );
    expect(style).toBe(
      '.component-with-separated-name {\n  // component-with-separated-name code\n}\n',
    );
  });

  it('Should style manage prefix component class', () => {
    // When
    createComponent(FAKE_SRC_DIR, 'component', 'prefix');

    // Then
    const { documentation, mixin, render, style } = componentFiles();
    expect(documentation).toBe('## Component\n');
    expect(mixin).toBe('mixin prefix-component\n  .prefix-component component\n');
    expect(render).toBe('extends /layout\n\nblock body\n  include component.code.pug\n');
    expect(style).toBe('.prefix-component {\n  // component code\n}\n');
  });

  it('Should create when component name has lower alphabetic separated by optional dash characters', () => {
    expect(() => createComponent(FAKE_SRC_DIR, 'UPPERCASE')).toThrow(
      'The component should have alphabetic characters separated by dashes: "U" at position 1 is not allowed',
    );
    expect(() => createComponent(FAKE_SRC_DIR, '-begin')).toThrow(
      'The component should have alphabetic characters separated by dashes: "-" at position 1 is not allowed',
    );
    expect(() => createComponent(FAKE_SRC_DIR, 'end-')).toThrow(
      'The component should have alphabetic characters separated by dashes: "-" at position 4 is not allowed',
    );
    expect(() => createComponent(FAKE_SRC_DIR, '')).toThrow('Component name should not be empty');
    expect(() => createComponent(FAKE_SRC_DIR, 'a-long-component')).not.toThrow();
  });

  it('Should create when prefix has lower alphabetic separated by optional dash characters', () => {
    expect(() => createComponent(FAKE_SRC_DIR, 'component', 'UPPERCASE')).toThrow(
      'The prefix should have alphabetic characters separated by dashes: "U" at position 1 is not allowed',
    );
    expect(() => createComponent(FAKE_SRC_DIR, 'component', '-begin')).toThrow(
      'The prefix should have alphabetic characters separated by dashes: "-" at position 1 is not allowed',
    );
    expect(() => createComponent(FAKE_SRC_DIR, 'component', 'end-')).toThrow(
      'The prefix should have alphabetic characters separated by dashes: "-" at position 4 is not allowed',
    );
    expect(() => createComponent(FAKE_SRC_DIR, 'a-long-component')).not.toThrow();
  });
});
