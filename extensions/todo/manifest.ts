import { ExtensionManifest } from '@altdot/extension';
import { name, description } from './package.json';

const manifest: ExtensionManifest = {
  name,
  description,
  title: 'To-Do',
  author: 'kholid060',
  categories: ['Productivity'],
  icon: 'todo',
  version: '0.0.1',
  commands: [
    {
      type: 'view',
      name: 'todo-list',
      title: 'To-Do List',
    },
  ],
  permissions: ['storage'],
};

export default manifest;
