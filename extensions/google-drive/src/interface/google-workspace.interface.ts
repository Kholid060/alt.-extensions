export interface GoogleDocsFile {
  title: string;
  documentId: string;
}

export interface GoogleSheetFile {
  title: string;
  spreadsheetId: string;
}

export interface GoogleWorkspaceConfig {
  title?: string;
}
