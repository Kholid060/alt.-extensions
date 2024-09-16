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
      config: [
        {
          type: 'toggle',
          required: false,
          defaultValue: false,
          name: 'openOnceDone',
          title: 'Open file once done',
          description:
            "Open the uploaded file in the browser once it's done uploading",
        },
      ],
    },
  ],
  permissions: ['shell', 'clipboard'],
};

export default config;
