import { _extension } from '@altdot/extension';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { homedir } from 'os';
import * as path from 'path';
import {
  InstalledExtension,
  RawInstalledExtension,
} from './interfaces/extension.interface';
import { exec } from 'child_process';

const vscodeExtensionsDir = path.join(homedir(), '/.vscode/extensions');

_extension.viewAction.async.on('vscode:list-extensions', async () => {
  const extensionsFile = path.join(vscodeExtensionsDir, 'extensions.json');
  if (!existsSync(extensionsFile)) {
    throw new Error("Couldn't find VSCode extensions directory");
  }

  const extensionsStr = await readFile(extensionsFile, { encoding: 'utf-8' });
  const extensions = JSON.parse(extensionsStr) as RawInstalledExtension[];
  const result: InstalledExtension[] = [];

  const seen = new Set<string>();

  await Promise.all(
    extensions.map(async (extension) => {
      if (seen.has(extension.identifier.id)) return;
      seen.add(extension.identifier.id);

      const pkgJSONStr = await readFile(
        path.join(
          vscodeExtensionsDir,
          extension.relativeLocation,
          'package.json',
        ),
        { encoding: 'utf-8' },
      );
      const pkgJSON = JSON.parse(pkgJSONStr);

      result.push({
        icon: pkgJSON.icon
          ? path.join(
              vscodeExtensionsDir,
              extension.relativeLocation,
              pkgJSON.icon,
            )
          : undefined,
        version: extension.version,
        id: extension.identifier.id,
        displayName: pkgJSON.displayName,
        location: extension.location.path,
        publisherId: extension.metadata.publisherId,
        installedTimestamp: extension.metadata.installedTimestamp,
        publisherDisplayName: extension.metadata.publisherDisplayName,
      });
    }),
  );

  return result;
});

_extension.viewAction.async.on('vscode:uninstall-extension', (id) => {
  return new Promise((resolve, reject) => {
    exec(`code --uninstall-extension ${id}`, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout);
    });
  });
});
