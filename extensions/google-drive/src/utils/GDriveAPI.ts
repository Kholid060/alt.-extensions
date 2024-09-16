import { GDFetchFilesResult } from '../interface/gdrive.interface';
import { getToken } from './get-token';

const API_BASE_URL = 'https://www.googleapis.com/drive/v3';

let accessTokenCache = '';

class GDriveAPI {
  static async authorizeFetch<T = unknown>(path: string, init?: RequestInit) {
    const url = new URL(`${API_BASE_URL}${path}`);

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
}

export default GDriveAPI;
