import { _extension } from '@altdot/extension';
import { GDFileMetadataStorage } from '../interface/gdrive.interface';

enum StorageKeys {
  RecentFiles = 'recent-file',
}

class DataStorage {
  static async getRecentFiles(): Promise<GDFileMetadataStorage[]> {
    const result = await _extension.storage.local.get(StorageKeys.RecentFiles);
    return (result[StorageKeys.RecentFiles] ?? []) as GDFileMetadataStorage[];
  }

  static setRecentFiles(files: GDFileMetadataStorage[]): Promise<void> {
    return _extension.storage.local.set(StorageKeys.RecentFiles, files);
  }
}

export default DataStorage;
