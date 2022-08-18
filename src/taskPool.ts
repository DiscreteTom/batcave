/** Return a promise which will be resolved after the specified `ms`. */
async function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type Task = () => Promise<void>;

/** Run async tasks with a concurrent limit. */
export class TaskPool {
  /** Concurrent limit. */
  private limit: number;
  /** Current concurrent. */
  private concurrent: number;
  /** How long to wait if the concurrent limit is reached, in ms. */
  private interval: number;
  /** Pool of promises. */
  private pool: Promise<void>[];

  constructor(limit: number, interval = 1000) {
    this.concurrent = 0;
    this.limit = limit;
    this.interval = interval;
    this.pool = [];
  }

  /** Execute the task if the concurrent under the limit. */
  private async run(task: Task) {
    // sleep until the concurrent under the limit
    while (this.concurrent >= this.limit) await sleep(this.interval);

    this.concurrent++;
    await task();
    this.concurrent--;
  }

  /** Submit a task to the pool, which will be executed if the concurrent under the limit. */
  submit(task: Task) {
    this.pool.push(this.run(task));
  }

  /** Return a promise which will be resolved after all tasks are done. */
  async await() {
    return Promise.all(this.pool);
  }
}
