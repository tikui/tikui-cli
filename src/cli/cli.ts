import * as path from 'path';
import * as fse from 'fs-extra';

const createFile = (folderPath: string, filename: string): void => fse.ensureFileSync(path.resolve(folderPath, filename));

export const createComponent = (basePath: string, component: string): void => {

  const componentDirectory = path.resolve(basePath, 'src', component);
  const componentName = component.split('/').slice(-1)[0];

  createFile(componentDirectory, componentName + '.md');
  createFile(componentDirectory, componentName + '.render.pug');
  createFile(componentDirectory, componentName + '.template.pug');
  createFile(componentDirectory, '_' + componentName + '.scss');
};
