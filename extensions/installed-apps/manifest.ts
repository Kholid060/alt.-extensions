import { ExtensionManifest } from '@altdot/extension';
import { name, version, description } from './package.json';

const manifest: ExtensionManifest = {
  name,
  version,
  description,
  title: 'Installed Apps',
  author: 'kholid060',
  categories: ['Applications'],
  icon: 'installed-apps',
  commands: [
    {
      type: 'view',
      name: 'search-apps',
      title: 'Search Installed Apps',
    },
  ],
};

export default manifest;
