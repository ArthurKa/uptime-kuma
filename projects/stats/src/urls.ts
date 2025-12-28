export const urls = {
  stats: {
    _: '/stats',
    get cpu() {
      return `${this._}/cpu` as const;
    },
    get ram() {
      return `${this._}/ram` as const;
    },
    get disks() {
      return `${this._}/disks` as const;
    },
    get maxLogsSize() {
      return `${this._}/max-logs-size` as const;
    },
  },
} as const;
