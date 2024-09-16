import type { ExtensionManifest } from '@altdot/extension';
import { name, version } from './package.json';

const config: ExtensionManifest = {
  name,
  version,
  author: 'kholid060',
  icon: 'google-drive',
  title: 'Google Drive',
  categories: ['Applications'],
  description: 'List Google Drive files',
  config: [
    {
      type: 'select',
      required: true,
      defaultValue: 'copy-clipboard',
      options: [
        { label: 'Copy to clipboard', value: 'copy-clipboard' },
        { label: 'Open in browser', value: 'open-in-browser' },
        {
          label: 'Copy to clipboard and open in browser',
          value: 'copy-open-in-browser',
        },
      ],
      name: 'fileAction',
      title: 'File action',
      description: 'Action to do once the file is created or uploaded',
    },
  ],
  commands: [
    {
      type: 'view',
      name: 'search',
      title: 'Search Google Drive',
      description: 'Search files or folders in Google Drive',
    },
    {
      type: 'action',
      name: 'upload-file',
      title: 'Upload File',
      arguments: [
        {
          required: true,
          name: 'filePath',
          type: 'input:text',
          title: 'File path',
          placeholder: 'D:\\file.txt',
          description: 'Path of the file to upload',
        },
      ],
    },
    {
      type: 'action',
      icon: 'google-docs',
      name: 'create-google-docs',
      title: 'Create Google Docs',
      description: 'Create a new Google Docs file',
      arguments: [
        {
          name: 'title',
          title: 'Title',
          type: 'input:text',
          placeholder: 'Untitled',
        },
      ],
    },
    {
      type: 'action',
      icon: 'google-sheets',
      name: 'create-google-sheets',
      title: 'Create Google Sheet',
      description: 'Create a new Google Sheets spreadsheet file',
      arguments: [
        {
          name: 'title',
          title: 'Title',
          type: 'input:text',
          placeholder: 'Untitled',
        },
      ],
    },
  ],
};

export default config;
