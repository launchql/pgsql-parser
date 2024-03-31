import { extname, basename } from 'path';

export const stripExtension = (filename) => {
  const extension = extname(filename);
  return basename(filename, extension);
}