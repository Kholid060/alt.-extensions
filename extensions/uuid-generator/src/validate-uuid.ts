import {
  _extension,
  CommandLaunchBy,
  CommandLaunchContext,
} from '@altdot/extension';
import { validate } from 'uuid';

function validateUUID({
  args,
  launchBy,
}: CommandLaunchContext<{ uuid: string }>) {
  if (launchBy === CommandLaunchBy.WORKFLOW) {
    return validate(args.uuid);
  }

  const isValid = validate(args.uuid);
  _extension.ui.showToast({
    type: isValid ? 'success' : 'error',
    title: isValid ? 'Valid UUID' : 'Invalid UUID',
  });
}

export default validateUUID;
