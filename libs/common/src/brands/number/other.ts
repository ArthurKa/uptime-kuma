import { Brand, WITNESS } from '@arthurka/ts-utils';
import { initializeByTypeGuard } from '../utils';
import { isNonNegative, NonNegative } from './common';

export type CPUPercentage = Brand<NonNegative, 'CPU'>;
export const isCPUPercentage = (e: unknown): e is CPUPercentage => isNonNegative(e);
export const CPUPercentage = (e: CPUPercentage[WITNESS]): CPUPercentage => (
  initializeByTypeGuard(e, isCPUPercentage, 'CPUPercentage')
);

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
