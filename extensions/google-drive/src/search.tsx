import { useEffect, useState } from 'react';
import {
  UiList,
  UiIcons,
  type UiListItem,
  _extension,
  CommandLaunchContext,
} from '@altdot/extension';
import { debounce, getFileLink } from './utils/helper';
import DataStorage from './utils/DataStorage';
import GDriveAPI from './utils/GDriveAPI';
import {
  GDFileMetadata,
  GDFileMetadataStorage,
} from './interface/gdrive.interface';
import { getToken } from './utils/get-token';

_extension.ui.searchPanel.updatePlaceholder(
  'Search Google Drive files or folders',
);
_extension.ui.searchPanel.clearValue();

const loadingToast = _extension.ui.createToast({
  type: 'loading',
  title: 'Searching files...',
});

function SearchGoogleDrive({ fallbackSearch }: CommandLaunchContext) {
  const [errorMessage, setErrorMessage] = useState('');

  const [recentFiles, setRecentFiles] = useState<GDFileMetadataStorage[]>([]);
  const [searchFiles, setSearchFiles] = useState<GDFileMetadata[] | null>(null);

  const listItems: UiListItem[] = (searchFiles || recentFiles).map((file) => ({
    value: file.id,
    title: file.name,
    subtitle: file.mimeType,
    group: searchFiles ? 'Search result' : 'Recent search',
    actions: [
      {
        type: 'button',
        value: 'copy-url',
        title: 'Copy file link',
        icon: UiIcons.Clipboard,
        onAction() {
          _extension.clipboard
            .write('text', getFileLink('drive', file.id))
            .then(() => {
              const toast = _extension.ui.createToast({
                type: 'success',
                title: 'Copied to clipboard',
              });
              toast.show();
            });
        },
      },
    ],
    icon: (
      <UiList.Icon
        icon={
          file.mimeType === 'application/vnd.google-apps.folder'
            ? UiIcons.Folder
            : UiIcons.File
        }
      />
    ),
  }));

  async function onItemSelected(fileId: string) {
    try {
      if (!searchFiles) return;

      let updatedRecentFiles = recentFiles;

      const fileIndex = recentFiles.findIndex((file) => file.id === fileId);
      if (fileIndex === -1) {
        const file = searchFiles.find((file) => file.id === fileId);
        updatedRecentFiles = [
          { ...file!, lastAccessed: Date.now() },
          ...updatedRecentFiles,
        ];
      } else {
        updatedRecentFiles = updatedRecentFiles
          .map((file) => {
            if (file.id === fileId)
              return { ...file, lastAccessed: Date.now() };

            return file;
          })
          .toSorted((a, z) => z.lastAccessed - a.lastAccessed);
      }

      await DataStorage.setRecentFiles(updatedRecentFiles);
      setRecentFiles(updatedRecentFiles);
    } catch (error) {
      console.error(error);
    } finally {
      _extension.shell.openURL(getFileLink('drive', fileId));
    }
  }

  useEffect(() => {
    const searchFiles = async (value: string) => {
      try {
        if (!value.trim()) {
          setSearchFiles(null);
          return;
        }

        loadingToast.show();

        const result = await GDriveAPI.searchFiles(value);

        setErrorMessage('');
        setSearchFiles(result.files);
      } catch (error) {
        console.error(error);
        setErrorMessage((error as Error).message);
      } finally {
        loadingToast.hide();
      }
    };

    const offListener = _extension.ui.searchPanel.onChanged.addListener(
      debounce(searchFiles, 500),
    );
    if (fallbackSearch) searchFiles(fallbackSearch);

    DataStorage.getRecentFiles().then(setRecentFiles);

    return () => {
      offListener();
    };
  }, []);

  return (
    <div className="p-2">
      {errorMessage === 'error' ? (
        <div className="text-destructive-text">
          <p>Error when fetching files:</p>
          <p>{errorMessage}</p>
        </div>
      ) : (
        <UiList
          items={listItems}
          shouldFilter={false}
          onItemSelected={onItemSelected}
        />
      )}
    </div>
  );
}

function ensureAuth(Component: typeof SearchGoogleDrive) {
  return (context: CommandLaunchContext) => {
    const [isAuth, setIsAuth] = useState<boolean>(false);

    useEffect(() => {
      getToken().finally(() => {
        setIsAuth(true);
      });
    }, []);

    if (!isAuth) return null;

    return <Component {...context} />;
  };
}

export default ensureAuth(SearchGoogleDrive);
