import { ExtensionManifest } from '@altdot/extension';
import { name, version, description } from './package.json';

const manifest: ExtensionManifest = {
  name,
  version,
  description,
  title: 'UUID Generator',
  author: 'kholid060',
  categories: ['Developer Tools'],
  icon: 'uuid-logo',
  commands: [
    {
      type: 'action',
      name: 'generate-uuid',
      title: 'Generate UUID',
      arguments: [
        {
          type: 'select',
          name: 'version',
          title: 'UUID Version',
          description: 'Select UUID Version, default to version 4',
          placeholder: 'Version',
          options: [
            { label: 'Version 1', value: 'v1' },
            { label: 'Version 4', value: 'v4' },
            { label: 'Version 6', value: 'v6' },
            { label: 'Version 7', value: 'v7' },
          ],
        },
      ],
    },
    {
      type: 'action',
      name: 'validate-uuid',
      title: 'Validate UUID',
      arguments: [
        {
          name: 'uuid',
          title: 'UUID',
          required: true,
          type: 'input:text',
          placeholder: 'UUID',
          description: 'Input UUID to validate',
        },
      ],
    },
  ],
};

export default manifest;
