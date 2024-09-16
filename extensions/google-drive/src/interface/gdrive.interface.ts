export interface GDFileMetadata {
  id: string;
  kind: string;
  name: string;
  mimeType: string;
}

export interface GDFileMetadataStorage extends GDFileMetadata {
  lastAccessed: number;
}

export interface GDFetchFilesResult {
  kind: 'drive#fileList';
  nextPageToken?: string;
  files: GDFileMetadata[];
  incompleteSearch: boolean;
}
