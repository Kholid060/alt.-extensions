import { CommandLaunchContext } from '@altdot/extension';
import { GoogleWorkspaceConfig } from './interface/google-workspace.interface';
import GDriveAPI from './utils/GDriveAPI';
import fileAction from './utils/fileAction';
import { getFileLink } from './utils/helper';

export default async function createGoogleSheets({
  args,
}: CommandLaunchContext<GoogleWorkspaceConfig>) {
  const result = await GDriveAPI.createGoogleSheets(args.title);
  await fileAction(getFileLink('google-sheets', result.spreadsheetId));
}
