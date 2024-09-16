import {
  GDFileMetadata,
  GDFetchFilesResult,
} from '../interface/gdrive.interface';
import {
  GoogleDocsFile,
  GoogleSheetFile,
} from '../interface/google-workspace.interface';
import { getToken } from './get-token';

const API_BASE_URL = {
  drive: 'https://www.googleapis.com/drive/v3',
  'google-docs': 'https://docs.googleapis.com/v1/documents',
  'drive-upload': 'https://www.googleapis.com/upload/drive/v3',
  'google-sheets': 'https://sheets.googleapis.com/v4/spreadsheets',
} as const;

export interface UploadFileMediaDetail {
  file: Buffer;
  fileName: string;
  contentType: string;
}

class GDriveAPI {
  static async authorizeFetch<T = unknown>(
    path: string,
    init?: RequestInit & { apiType?: keyof typeof API_BASE_URL },
  ) {
    const url = new URL(`${API_BASE_URL[init?.apiType ?? 'drive']}${path}`);

    const { accessToken } = await getToken();
    url.searchParams.set('access_token', accessToken);

    const response = await fetch(url, init);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result?.error?.message || response.statusText);
    }

    return result as T;
  }

  static searchFiles(name: string) {
    return this.authorizeFetch<GDFetchFilesResult>(
      `/files?q=${encodeURIComponent(`name contains '${name}'`)}`,
    );
  }

  static uploadFileMultipart({
    file,
    fileName,
    contentType,
  }: UploadFileMediaDetail) {
    const metadata = {
      name: fileName,
      mimeType: contentType,
    };
    const boundary = 'xxxxxxxxxx';
    let data = `--${boundary}\r\n`;
    data += 'Content-Disposition: form-data; name="metadata"\r\n';
    data += 'Content-Type: application/json; charset=UTF-8\r\n\r\n';
    data += JSON.stringify(metadata) + '\r\n';
    data += `--${boundary}\r\n`;
    data += 'Content-Disposition: form-data; name="file"\r\n\r\n';
    const payload = Buffer.concat([
      Buffer.from(data, 'utf8'),
      file,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8'),
    ]);

    return this.authorizeFetch<GDFileMetadata>('/files?uploadType=multipart', {
      body: payload,
      method: 'POST',
      apiType: 'drive-upload',
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
      },
    });
  }

  static createGoogleDocs(title?: string): Promise<GoogleDocsFile> {
    return this.authorizeFetch<GoogleDocsFile>('', {
      method: 'POST',
      apiType: 'google-docs',
      body: JSON.stringify({
        title,
      }),
    });
  }
  static createGoogleSheets(title?: string) {
    return this.authorizeFetch<GoogleSheetFile>('', {
      method: 'POST',
      apiType: 'google-sheets',
      body: JSON.stringify({
        properties: { title },
      }),
    });
  }
}

export default GDriveAPI;
