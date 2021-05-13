import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Tree } from '@angular-devkit/schematics';

const migrationSchematicRunner = new SchematicTestRunner(
  '@angular-eslint/schematics',
  path.join(__dirname, '../../../src/migrations.json'),
);

describe('update-12-0-0', () => {
  let appTree: UnitTestTree;
  beforeEach(() => {
    appTree = new UnitTestTree(Tree.empty());
    appTree.create(
      'package.json',
      JSON.stringify({
        devDependencies: {
          '@angular-eslint/builder': '4.3.0',
          '@angular-eslint/eslint-plugin': '4.3.0',
          '@angular-eslint/eslint-plugin-template': '4.3.0',
          '@angular-eslint/template-parser': '4.3.0',
          '@typescript-eslint/eslint-plugin': '4.16.1',
          '@typescript-eslint/experimental-utils': '4.16.1',
          '@typescript-eslint/parser': '4.16.1',
          eslint: '^7.6.0',
        },
      }),
    );
    appTree.create(
      'angular.json',
      JSON.stringify({
        $schema: './node_modules/@angular/cli/lib/config/schema.json',
        version: 1,
        newProjectRoot: 'projects',
        projects: {
          foo: {
            root: 'projects/foo',
          },
          bar: {
            root: 'projects/bar',
          },
        },
      }),
    );
  });

  it('should update relevant @angular-eslint, @typescript-eslint and eslint dependencies', async () => {
    const tree = await migrationSchematicRunner
      .runSchematicAsync('update-12-0-0', {}, appTree)
      .toPromise();
    const packageJSON = JSON.parse(tree.readContent('/package.json'));
    expect(packageJSON).toMatchInlineSnapshot(`
      Object {
        "devDependencies": Object {
          "@angular-eslint/builder": "^12.0.0",
          "@angular-eslint/eslint-plugin": "^12.0.0",
          "@angular-eslint/eslint-plugin-template": "^12.0.0",
          "@angular-eslint/template-parser": "^12.0.0",
          "@typescript-eslint/eslint-plugin": "4.23.0",
          "@typescript-eslint/experimental-utils": "4.23.0",
          "@typescript-eslint/parser": "4.23.0",
          "eslint": "^7.26.0",
        },
      }
    `);
  });
});
