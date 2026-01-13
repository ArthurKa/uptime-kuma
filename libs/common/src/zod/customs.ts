import { typeOf } from '@arthurka/ts-utils';
import { z } from 'zod/v4';
import { isCPUPercentage, isDiskUsage, isFileSizeGB, isRAMUsage } from '../brands';

const makeCustomErrorMessage = (name: string) => ({
  error({ input }: { input: unknown }) {
    return `${JSON.stringify(input)} of type ${typeOf(input)} is not valid ${name}`;
  },
});

export const customCPUPercentage = z.custom(isCPUPercentage, makeCustomErrorMessage('CPUPercentage'));
export const customRAMUsage = z.custom(isRAMUsage, makeCustomErrorMessage('RAMUsage'));
export const customDiskUsage = z.custom(isDiskUsage, makeCustomErrorMessage('DiskUsage'));
export const customFileSizeGB = z.custom(isFileSizeGB, makeCustomErrorMessage('FileSizeGB'));
