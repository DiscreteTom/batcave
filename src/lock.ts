/** Return a promise which will be resolved after the specified `ms`. */
async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export class Lock {
  concurrent: number;
  limit: number;
  interval: number;

  constructor(limit = 1, interval = 1000) {
    this.concurrent = 0;
    this.limit = limit;
    this.interval = interval;
  }

  async lock(f: () => Promise<void>) {
    while (this.concurrent >= this.limit) await sleep(this.interval);

    this.concurrent++;
    await f();
    this.concurrent--;
  }
}
