import { ExtensionManifest } from '@altdot/extension';
import { name, version, description } from './package.json';
import { ExtensionCommandArgument } from '@altdot/extension/dist/extension-manifest';

const hashArguments: ExtensionCommandArgument[] = [
  {
    name: 'input',
    title: 'Input',
    required: true,
    type: 'input:text',
    placeholder: 'value',
    description: 'Value to hash',
  },
  {
    name: 'hash',
    type: 'select',
    required: true,
    title: 'Hash type',
    placeholder: 'Select hash',
    options: [
      { label: 'MD5', value: 'md5' },
      { label: 'SHA1', value: 'sha1' },
      { label: 'SHA256', value: 'sha256' },
      { label: 'SHA512', value: 'sha512' },
    ],
  },
  {
    name: 'outputType',
    type: 'select',
    title: 'Output type',
    placeholder: 'Output type',
    description: 'Default to hex',
    options: [
      { label: 'HEX', value: 'hex' },
      { label: 'Base64', value: 'base64' },
      { label: 'Base64 URL', value: 'base64url' },
    ],
  },
];

const manifest: ExtensionManifest = {
  name,
  version,
  description,
  title: 'Hash Generator',
  author: 'kholid060',
  categories: ['Developer Tools'],
  icon: 'hash',
  commands: [
    {
      type: 'action',
      name: 'generate-hash',
      title: 'Generate Hash',
      arguments: hashArguments,
    },
    {
      type: 'action',
      name: 'generate-hash-hmac',
      title: 'Generate Hash with HMAC',
      arguments: hashArguments.toSpliced(1, 0, {
        required: true,
        type: 'input:text',
        name: 'secretKey',
        title: 'Secret key',
        placeholder: 'Secret key',
      }),
    },
  ],
};

export default manifest;
