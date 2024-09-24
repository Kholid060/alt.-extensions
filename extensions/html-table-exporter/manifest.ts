import { ExtensionManifest } from '@altdot/extension';
import { name, version, description } from './package.json';

const manifest: ExtensionManifest = {
  name,
  version,
  description,
  title: 'HTML Table Exporter',
  author: 'kholid060',
  categories: ['Productivity'],
  icon: 'table-exporter',
  commands: [
    {
      type: 'action',
      name: 'table-exporter',
      title: 'Export HTML Table',
      config: [
        {
          required: false,
          name: 'saveLocation',
          type: 'input:directory',
          title: 'Files save location',
        },
        {
          required: false,
          type: 'toggle',
          defaultValue: true,
          name: 'showWhenDone',
          title: 'Show file when done',
          description:
            'Show the exported table file in the file manager when done exporting',
        },
      ],
      arguments: [
        {
          name: 'exportAs',
          title: 'Export table as',
          placeholder: 'Export as',
          description: 'Default to "CSV"',
          type: 'select',
          options: [
            { value: 'csv', label: 'CSV' },
            { value: 'excel', label: 'Excel' },
            { value: 'json', label: 'JSON' },
          ],
        },
      ],
    },
  ],
};

export default manifest;
