import { ExtensionManifest } from '@altdot/extension';
import { name, version, description } from './package.json';

const manifest: ExtensionManifest = {
  name,
  version,
  description,
  title: 'Visual Studio Code',
  author: 'kholid060',
  categories: ['Other'],
  icon: 'vscode',
  commands: [
    {
      type: 'action',
      name: 'create-new-window',
      title: 'Create New Window',
      description: 'Create a new Visual Studio Code window',
    },
    {
      type: 'view',
      name: 'manage-extensions',
      title: 'Manage Installed Extensions',
    },
    {
      type: 'view',
      name: 'recent-projects',
      title: 'Recent Projects',
      description: 'Search recently opened files or folders in VSCode',
    },
  ],
};

export default manifest;
