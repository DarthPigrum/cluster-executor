'use strict';
const cluster = require('cluster');
const vm = require('vm');
if (cluster.isMaster) {
  module.exports = class WorkerPool {
    constructor(size = 0) {
      this.workers = [];
      this.allowSpawn = false;
      for (let n = 0; n < size; n++) this.workers[n] = cluster.fork();
    }
    run(fn, ...args) {
      if (this.workers.length === 0 && !this.allowSpawn) {
        const promise = new Promise((resolve, reject) =>
          reject(new Error('Pool size exceeded')));
        return { promise };
      }
      const fromPool = (this.workers.length !== 0);
      const worker = fromPool ? this.workers.pop() : cluster.fork();
      worker.send(JSON.stringify([fn.toString(), ...args]));
      let done = false;
      const promise = new Promise((resolve, reject) => {
        worker.on('message', (msg) => {
          done = true;
          fromPool ? this.workers.push(worker) : worker.process.kill();
          msg.error ? reject(msg.error) : resolve(msg.result);
        });
      });
      const cancel = () => {
        if (!done) {
          done = true;
          worker.process.kill();
          if (fromPool) this.workers.push(cluster.fork());
          return true;
        } else { return false; }
      };
      return { promise, cancel };
    }
  };
} else {
  process.on('message', (msg) => {
    try {
      const args = JSON.parse(msg);
      const script = vm.createScript(args.shift());
      const fn = script.runInNewContext({ require });
      process.send({ result: fn(...args) });
    } catch (error) {
      process.send({ error });
    }
  });
}
