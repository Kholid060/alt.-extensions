export interface InstalledExtension {
  id: string;
  icon?: string;
  version: string;
  location: string;
  displayName: string;
  publisherId: string;
  installedTimestamp: number;
  publisherDisplayName: string;
}

export interface RawInstalledExtension {
  identifier: {
    id: string;
    uuid: string;
  };
  version: string;
  location: {
    $mid: number;
    path: string;
    scheme: string;
  };
  relativeLocation: string;
  metadata: {
    id: string;
    publisherId: string;
    publisherDisplayName: string;
    targetPlatform: string;
    updated: boolean;
    isPreReleaseVersion: boolean;
    hasPreReleaseVersion: boolean;
    installedTimestamp: number;
    source: string;
  };
}
