import {
  GDFileMetadata,
  GDFetchFilesResult,
} from '../interface/gdrive.interface';
import { getToken } from './get-token';

const API_BASE_URL = 'https://www.googleapis.com/drive/v3';
const API_UPLOAD_BASE_URL = 'https://www.googleapis.com/upload/drive/v3';

let accessTokenCache = '';

export interface UploadFileMediaDetail {
  file: Buffer;
  fileName: string;
  contentType: string;
}

class GDriveAPI {
  static async authorizeFetch<T = unknown>(
    path: string,
    init?: RequestInit & { isUpload?: boolean },
  ) {
    const url = new URL(
      `${init?.isUpload ? API_UPLOAD_BASE_URL : API_BASE_URL}${path}`,
    );

    if (!accessTokenCache) accessTokenCache = (await getToken()).accessToken;
    url.searchParams.set('access_token', accessTokenCache);

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
      isUpload: true,
      headers: {
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
      },
    });
  }
}

export default GDriveAPI;
