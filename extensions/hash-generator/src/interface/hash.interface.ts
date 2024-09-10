export type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512';

export type HashOutputType = 'hex' | 'base64' | 'base64url';

export interface HashCommandArgs {
  input: string;
  hash: HashType;
  outputType?: HashOutputType;
}
