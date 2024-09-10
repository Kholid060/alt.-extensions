import { useEffect, useState } from 'react';
import { _extension, UiIcons, UiList, UiListItem } from '@altdot/extension';

type RecentProjectItem = { folderUri: string } | { fileUri: string };

async function fetchRecentProjects(): Promise<RecentProjectItem[]> {
  let { vscodeDbPath } = await _extension.storage.local.get('vscodeDbPath');
  if (!vscodeDbPath) {
    vscodeDbPath =
      await _extension.viewAction.async.sendMessage('vscode:get-db-path');

    if (vscodeDbPath) {
      await _extension.storage.local.set('vscodeDbPath', vscodeDbPath);
    }
  }
  if (!vscodeDbPath) {
    throw new Error("Couldn't find Visual Studio Code directory");
  }

  const db = _extension.sqlite.open({ path: vscodeDbPath as string });
  const result = await db
    .sql(
      `SELECT value FROM ItemTable WHERE key='history.recentlyOpenedPathsList'`,
    )
    .get<{ value: string }>();

  return JSON.parse(result.value).entries as RecentProjectItem[];
}

function RecentProjects() {
  const [errorMessage, setErrorMessage] = useState('');
  const [recentProjects, setRecentProjects] = useState<RecentProjectItem[]>([]);

  const listItems: UiListItem[] = recentProjects.map((item) => {
    const isFile = 'fileUri' in item;
    const path = decodeURIComponent(
      (isFile ? item.fileUri : item.folderUri).replace('file:///', ''),
    );

    const pathnameArr = path.split('/');
    const title = pathnameArr.pop();

    return {
      title,
      value: path,
      icon: <UiList.Icon icon={isFile ? UiIcons.File : UiIcons.Folder} />,
      group: isFile ? 'Files' : 'Folders',
      subtitle: pathnameArr.join('/'),
      actions: [
        {
          type: 'button',
          value: 'open-file',
          icon: UiIcons.FolderOpen,
          title: `Open ${isFile ? 'file' : 'folder'} location`,
          onAction() {
            _extension.shell.showItemInFolder(path);
          },
        },
      ],
    };
  });

  useEffect(() => {
    fetchRecentProjects()
      .then(setRecentProjects)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  return (
    <div className="p-2">
      {errorMessage ? (
        <p className="text-center text-destructive-text">{errorMessage}</p>
      ) : (
        <UiList
          items={listItems}
          onItemSelected={(path) => {
            _extension.viewAction.sync.sendMessage('vscode:open-path', path);
          }}
        />
      )}
    </div>
  );
}

export default RecentProjects;
