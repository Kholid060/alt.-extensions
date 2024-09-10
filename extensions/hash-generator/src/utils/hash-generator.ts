import { createHash, createHmac } from 'node:crypto';
import { HashOutputType, HashType } from '../interface/hash.interface';

export interface HashGeneratorOptions {
  input: string;
  hash: HashType;
  secretKey?: string;
  outputType: HashOutputType;
}

export function hashGenerator({
  hash,
  input,
  secretKey,
  outputType,
}: HashGeneratorOptions) {
  if (secretKey) {
    return createHmac(hash, secretKey).update(input).digest(outputType);
  }

  return createHash(hash).update(input).digest(outputType);
}
