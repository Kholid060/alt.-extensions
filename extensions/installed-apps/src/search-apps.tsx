import {
  _extension,
  UiIcons,
  UiImage,
  UiList,
  UiListItem,
} from '@altdot/extension';
import { useEffect, useState } from 'react';

function appType(path: string) {
  if (path.endsWith('.exe') || path.endsWith('.msc')) return 'Application';
  if (path.endsWith('.url')) return 'Internet shortcut application';

  return 'File';
}

function SearchApps() {
  const [installedApps, setInstalledApps] = useState<
    _extension.Shell.InstalledApps.AppDetail[]
  >([]);

  const apps: UiListItem[] = installedApps.map((app) => ({
    title: app.name,
    value: app.appId,
    icon: (
      <UiImage src={_extension.shell.installedApps.getIconURL(app.appId)} />
    ),
    subtitle: appType(app.path),
    actions: [
      {
        onAction() {
          _extension.shell.showItemInFolder(app.path);
        },
        type: 'button',
        icon: UiIcons.FolderOpen,
        value: 'open-folder',
        title: 'Open containing folder',
        shortcut: { key: 'e', mod1: 'mod' },
      },
    ],
  }));

  useEffect(() => {
    _extension.shell.installedApps.query().then(setInstalledApps);
  }, []);

  return (
    <div className="p-2">
      <UiList
        items={apps}
        onItemSelected={(appId) => {
          _extension.ui.closeWindow();
          _extension.shell.installedApps.launch(appId);
        }}
      />
    </div>
  );
}

export default SearchApps;
