import { ExtensionManifest } from '@altdot/extension';
import { name, version, description } from './package.json';

const manifest: ExtensionManifest = {
  name,
  version,
  description,
  title: 'Calculator',
  author: 'kholid060',
  categories: ['Productivity'],
  icon: 'calculator',
  commands: [
    {
      type: 'view',
      name: 'calculator',
      title: 'Calculator',
    },
    {
      type: 'view',
      name: 'unit-converter',
      title: 'Unit Converter',
    },
  ],
};

export default manifest;
