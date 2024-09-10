import {
  _extension,
  CommandLaunchBy,
  CommandLaunchContext,
} from '@altdot/extension';
import { v1, v4, v6, v7 } from 'uuid';

type UuidVersion = 'v1' | 'v4' | 'v6' | 'v7';

function uuidGenerator(version: UuidVersion) {
  switch (version) {
    case 'v1':
      return v1();
    case 'v4':
      return v4();
    case 'v6':
      return v6();
    case 'v7':
      return v7();
  }
}

async function generateUUID({
  args,
  launchBy,
}: CommandLaunchContext<{ version?: UuidVersion }>) {
  const version = args.version ?? 'v4';
  if (launchBy === CommandLaunchBy.WORKFLOW) return uuidGenerator(version);

  await _extension.clipboard.write('text', uuidGenerator(version));
  _extension.ui.showToast({
    title: 'UUID copied to the clipboard',
  });
}

export default generateUUID;
