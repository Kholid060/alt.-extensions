import {
  _extension,
  CommandLaunchBy,
  CommandLaunchContext,
} from '@altdot/extension';
import { existsSync } from 'fs';
import * as fs from 'fs/promises';
import GDriveAPI from './utils/GDriveAPI';
import { lookup } from 'mime-types';
import * as path from 'path';
import fileAction from './utils/fileAction';
import { getFileLink } from './utils/helper';

const MAX_FILE_SIZE_MB = 1024 * 1024 * 5; // 5 MB

async function UploadFile({
  args,
  launchBy,
}: CommandLaunchContext<{ filePath: string }>) {
  let loadingToast: _extension.UI.Toast | null = null;

  try {
    if (!existsSync(args.filePath)) {
      throw new Error("Couldn't find file");
    }

    const fileStat = await fs.stat(args.filePath);
    if (fileStat.size > MAX_FILE_SIZE_MB) {
      throw new Error(
        'This command currently only supports uploading a file up to 5 MB',
      );
    }

    const fileName = path.basename(args.filePath);

    const isInWorkflow = launchBy === CommandLaunchBy.WORKFLOW;
    if (!isInWorkflow) {
      loadingToast = _extension.ui.createToast({
        type: 'loading',
        title: `Uploading "${fileName}"`,
      });
    }

    const contentType = lookup(args.filePath).toString();
    const result = await GDriveAPI.uploadFileMultipart({
      fileName,
      contentType,
      file: await fs.readFile(args.filePath),
    });

    if (isInWorkflow) return result;

    await fileAction(getFileLink('drive', result.id));

    return result;
  } finally {
    loadingToast?.hide();
  }
}

export default UploadFile;
