### WorkerPool based on cluster that allows executing synchronous functions asynchronously using forks stored in pool
[![Build Status](https://travis-ci.org/DarthPigrum/cluster-executor.svg?branch=master)](https://travis-ci.org/DarthPigrum/cluster-executor)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8d162e00881c4673a508ad60bd160118)](https://www.codacy.com/app/DarthPigrum/cluster-executor?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=DarthPigrum/cluster-executor&amp;utm_campaign=Badge_Grade)
[![npm version](https://badge.fury.io/js/cluster-executor.svg)](https://badge.fury.io/js/cluster-executor)
#### Usage
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
