#!/usr/bin/env node
import run from './index';

var argv = require('minimist')(process.argv.slice(2));

(async () => {
  await run(argv);
})();
