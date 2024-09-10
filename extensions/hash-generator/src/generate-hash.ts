import {
  _extension,
  CommandLaunchBy,
  CommandLaunchContext,
} from '@altdot/extension';
import { HashCommandArgs } from './interface/hash.interface';
import { hashGenerator, HashGeneratorOptions } from './utils/hash-generator';

async function generateHash({
  args,
  launchBy,
}: CommandLaunchContext<HashCommandArgs>) {
  const hashArgs: HashGeneratorOptions = {
    ...args,
    outputType: 'hex',
  };

  if (launchBy === CommandLaunchBy.WORKFLOW) {
    return hashGenerator(hashArgs);
  }

  await _extension.clipboard.write('text', hashGenerator(hashArgs));
  _extension.ui.showToast({
    title: 'Hash copied to the clipboard',
  });
}

export default generateHash;
