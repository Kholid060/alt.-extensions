import { _extension } from '@altdot/extension';
import { exec } from 'child_process';
import { existsSync } from 'fs';
import * as os from 'os';
import * as path from 'path';

const vscodeDataDir = path.join(os.homedir(), '/AppData/Roaming/Code');

_extension.viewAction.async.on('vscode:get-db-path', () => {
  const vscodeDbPath = path.join(
    vscodeDataDir,
    'User/globalStorage/state.vscdb',
  );
  return Promise.resolve(existsSync(vscodeDbPath) ? vscodeDbPath : null);
});

_extension.viewAction.sync.on('vscode:open-path', (value) => {
  exec(`code ${value}`);
});
