# WorkerPool based on cluster that allows executing synchronous functions asynchronously using forks stored in pool
[![Build Status](https://travis-ci.org/DarthPigrum/cluster-executor.svg?branch=master)](https://travis-ci.org/DarthPigrum/cluster-executor)
## Usage
```javascript
const { isMaster } = require('cluster');
const WorkerPool = require('cluster-executor');
if (isMaster) { //wrapping all your code into isMaster check is required
  const hardFunction = (n) => {
    const somelib = require('somelib'); //require should be inside the function
    //do some calculations
    return `Result of calculations #${n}`;
  };
  const pool = new WorkerPool(4);
  const emptyPool = new WorkerPool();
  emptyPool.allowSpawn = true; //set this flag if you want to allow spawning additional forks
  const task1 = pool.run(hardFunction, 1);
  const task2 = emptyPool.run(hardFunction, 2);
  task1.promise.then(console.log);
  task2.promise.then(console.log);
}
```
