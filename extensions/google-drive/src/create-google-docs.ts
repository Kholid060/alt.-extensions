import { CommandLaunchContext } from '@altdot/extension';
import { GoogleWorkspaceConfig } from './interface/google-workspace.interface';
import GDriveAPI from './utils/GDriveAPI';
import fileAction from './utils/fileAction';
import { getFileLink } from './utils/helper';

export default async function createGoogleDocs({
  args,
}: CommandLaunchContext<GoogleWorkspaceConfig>) {
  const result = await GDriveAPI.createGoogleDocs(args.title);
  await fileAction(getFileLink('google-docs', result.documentId));
}
