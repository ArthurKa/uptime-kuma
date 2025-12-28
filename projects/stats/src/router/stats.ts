import { Express } from 'express';
import { NODE_ENV } from '@repo/common/src/envVariables/public';
import { routes } from '@repo/common/src/zod';
import si from 'systeminformation';
import os from 'os';
import { getNotUndefined, isArrayLength, round } from '@arthurka/ts-utils';
import { CPUPercentage, DiskUsage, FileSizeGB, RAMUsage } from '@repo/common/src/brands';
import assert from 'assert';
import { exec } from 'child_process';
import { urls } from '../urls';

const execAsync = (path: string) => (
  new Promise<string>(res => {
    exec(path, (error, stdout) => {
      res(stdout);
    });
  })
);

const getCPU = () => (
  new Promise<CPUPercentage>(res => {
    process.nextTick(() => {
      const avgFor1Min = getNotUndefined(os.loadavg()[0], 'This should never happen. |kkn3zd|');
      const { length } = os.cpus();
      assert(length > 0, 'Something went wrong. |8118t6|');

      res(CPUPercentage(round(avgFor1Min * 100 / length, 2)));
    });
  })
);
const getRAM = async () => {
  const { available } = await si.mem();

  return RAMUsage(round(available / 1024 ** 3, 2));
};
const getDisks = async () => {
  const disks = await si.fsSize();

  return disks.map(e => (
    DiskUsage(round(e.available / 1024 ** 3, 2))
  ));
};
const getMaxLogsSize = async (): Promise<FileSizeGB> => {
  const dockerContainersFolder = NODE_ENV === 'development' ? '../../max-logs-size-test-folder' : '/docker-containers-volume';
  const [localFileLogs, jsonFileLogs] = await Promise.all([
    execAsync(`ls -lAF ${dockerContainersFolder}/*/local-logs`),
    execAsync(`ls -lAF ${dockerContainersFolder}/*/*-json.log`),
  ]);

  const sizes = [
    ...[...localFileLogs.matchAll(/total (\d+)\n/g)].map(e => (
      FileSizeGB(round(+getNotUndefined(e[1], 'This should never happen. |x3q62y|') / 1000 ** 2, 2))
    )),
    ...jsonFileLogs.trim().split('\n').filter(e => e !== '').map(e => (
      FileSizeGB(round(+getNotUndefined(e.split(/\s+/)[4], 'This should never happen. |iz6rza|') / 1024 ** 3, 2))
    )),
  ];

  return !isArrayLength(sizes, '>', 0) ? FileSizeGB(0) : Math.max(...sizes);
};

export const mountStats = (app: Express) => {
  app.get<unknown, routes.stats._.RouteResponse>(urls.stats._, async (req, res) => {
    const [cpu, ram, disks, maxLogsSize] = await Promise.all([
      getCPU(),
      getRAM(),
      getDisks(),
      getMaxLogsSize(),
    ]);

    res.json({
      success: true,
      data: {
        cpu,
        ram,
        disks,
        maxLogsSize,
      },
    });
  });

  app.get<unknown, routes.stats.cpu.RouteResponse>(urls.stats.cpu, async (req, res) => {
    res.json({
      success: true,
      data: await getCPU(),
    });
  });

  app.get<unknown, routes.stats.ram.RouteResponse>(urls.stats.ram, async (req, res) => {
    res.json({
      success: true,
      data: await getRAM(),
    });
  });

  app.get<unknown, routes.stats.disks.RouteResponse>(urls.stats.disks, async (req, res) => {
    res.json({
      success: true,
      data: await getDisks(),
    });
  });

  app.get<unknown, routes.stats.maxLogsSize.RouteResponse>(urls.stats.maxLogsSize, async (req, res) => {
    res.json({
      success: true,
      data: await getMaxLogsSize(),
    });
  });
};
