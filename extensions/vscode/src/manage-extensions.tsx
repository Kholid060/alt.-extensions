import { useEffect, useState } from 'react';
import { _extension, UiIcons, UiList, UiListItem } from '@altdot/extension';
import { InstalledExtension } from './interfaces/extension.interface';

function RecentProjects() {
  const [errorMessage, setErrorMessage] = useState('');
  const [extensions, setExtensions] = useState<InstalledExtension[]>([]);

  const listItems: UiListItem[] = extensions.map((extension) => {
    return {
      value: extension.id,
      title: extension.displayName,
      icon: extension.icon ? (
        <img
          loading="lazy"
          src={_extension.runtime.getFileThumbnailURL(
            encodeURIComponent(extension.icon),
          )}
        />
      ) : (
        <UiList.Icon icon={UiIcons.Atom} />
      ),
      actions: [
        {
          type: 'button',
          value: 'uninstall',
          color: 'destructive',
          icon: UiIcons.Trash,
          title: 'Uninstall extension',
          onAction() {
            const toast = _extension.ui.createToast({
              type: 'loading',
              title: `Uninstalling "${extension.displayName}" extension`,
            });
            toast.show();

            _extension.viewAction.async
              .sendMessage('vscode:uninstall-extension', extension.id)
              .then(() =>
                setExtensions(
                  extensions.filter((item) => item.id !== extension.id),
                ),
              )
              .catch((error) => {
                _extension.ui.showToast({
                  type: 'error',
                  title: error.message,
                });
              })
              .finally(() => toast.hide());
          },
        },
      ],
      subtitle: extension.publisherDisplayName,
    };
  });

  useEffect(() => {
    _extension.viewAction.async
      .sendMessage('vscode:list-extensions')
      .then(setExtensions)
      .catch((error) => setErrorMessage(error.message));
  }, []);

  return (
    <div className="p-2">
      {errorMessage ? (
        <p className="text-center text-destructive-text">{errorMessage}</p>
      ) : (
        <UiList
          items={listItems}
          onItemSelected={(value) => {
            _extension.shell.openURL(
              `https://marketplace.visualstudio.com/items?itemName=${value}`,
            );
          }}
        />
      )}
    </div>
  );
}

export default RecentProjects;
