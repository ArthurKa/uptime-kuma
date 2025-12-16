import { Brand, WITNESS } from '@arthurka/ts-utils';
import { initializeByTypeGuard } from '../utils';
import { isNonNegative, NonNegative } from './common';

export type Percentage = Brand<NonNegative, '<= 100'>;
export const isPercentage = (e: unknown): e is Percentage => (
  true
    && isNonNegative(e)
    && e <= 100
);
export const Percentage = (e: Percentage[WITNESS]): Percentage => (
  initializeByTypeGuard(e, isPercentage, 'Percentage')
);

export type CPUPercentage = Brand<Percentage, 'CPU'>;
export const isCPUPercentage = (e: unknown): e is CPUPercentage => isPercentage(e);
export const CPUPercentage = (e: CPUPercentage[WITNESS]): CPUPercentage => (
  initializeByTypeGuard(e, isCPUPercentage, 'CPUPercentage')
);
