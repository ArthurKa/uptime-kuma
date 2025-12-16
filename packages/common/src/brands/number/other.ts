import { Brand, WITNESS } from '@arthurka/ts-utils';
import { initializeByTypeGuard } from '../utils';
import { isNonNegative, NonNegative } from './common';

export type RAMUsage = Brand<NonNegative, 'RAM'>;
export const isRAMUsage = (e: unknown): e is RAMUsage => isNonNegative(e);
export const RAMUsage = (e: RAMUsage[WITNESS]): RAMUsage => (
  initializeByTypeGuard(e, isRAMUsage, 'RAMUsage')
);

export type DiskUsage = Brand<NonNegative, 'DiskUsage'>;
export const isDiskUsage = (e: unknown): e is DiskUsage => isNonNegative(e);
export const DiskUsage = (e: DiskUsage[WITNESS]): DiskUsage => (
  initializeByTypeGuard(e, isDiskUsage, 'DiskUsage')
);
