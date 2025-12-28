import { Brand, WITNESS } from '@arthurka/ts-utils';
import { isNonNegative, NonNegative } from './common';
import { initializeByTypeGuard } from '../utils';

export type FileSize = Brand<NonNegative, 'FileSize'>;
export const isFileSize = (e: unknown): e is FileSize => isNonNegative(e);
export const FileSize = (e: FileSize[WITNESS]): FileSize => (
  initializeByTypeGuard(e, isFileSize, 'FileSize')
);

export type FileSizeGB = Brand<FileSize, 'in GB'>;
export const isFileSizeGB = (e: unknown): e is FileSizeGB => isFileSize(e);
export const FileSizeGB = (e: FileSizeGB[WITNESS]): FileSizeGB => (
  initializeByTypeGuard(e, isFileSizeGB, 'FileSizeGB')
);
