import {
  _extension,
  CommandLaunchBy,
  CommandLaunchContext,
} from '@altdot/extension';
import { GoogleWorkspaceConfig } from './interface/google-workspace.interface';
import GDriveAPI from './utils/GDriveAPI';
import fileAction from './utils/fileAction';
import { getFileLink } from './utils/helper';

export default async function createGoogleSheets({
  args,
  launchBy,
}: CommandLaunchContext<GoogleWorkspaceConfig>) {
  const toast =
    launchBy !== CommandLaunchBy.WORKFLOW
      ? _extension.ui.createToast({ title: 'Creating file', type: 'loading' })
      : null;
  toast?.show();

  const result = await GDriveAPI.createGoogleSheets(args.title);
  await fileAction(getFileLink('google-sheets', result.spreadsheetId));

  toast?.hide();
}
