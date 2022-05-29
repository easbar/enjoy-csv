import chalk from 'chalk';
import {
  checkNodeVersion,
  startEnjoyCsv,
  processArguments,
  somethingWentWrong,
} from './src/libs/cli.js';
import { processCsv } from './src/libs/csv.js';
import { foodsoftHeaders } from './src/libs/foodsoft.js';
import bode, {
  resetNameMemory,
  getUniqueCategories,
} from './src/modes/bode.js';

import demo from './src/modes/demo.js';
import bode2 from './src/modes/bode/bode2.js';
import removeDuplicates from './src/modes/bode/remove_duplicates.js'

async function enjoy(args) {
  startEnjoyCsv();
  console.log(chalk.blue(`MODE: ${args.mode}`));
  console.log(`⏳ Processing! Just wait a sec ...`);

  switch (args.mode) {
    case 'demo':
      await processCsv(args, demo);
      break;
    case 'bode':
      await processCsv(args, bode, { outputHeaders: foodsoftHeaders });
      resetNameMemory();
      console.log(getUniqueCategories());
      break;
    case 'bode2':
      await processCsv(args, bode2);
      break;
    case 'remove_duplicates':
      await processCsv(args, removeDuplicates);
      break;
    default:
      somethingWentWrong(`
Mode ${args.mode} is not available!
Available modes: demo`);
  }
  console.log(`✅ Done!`);
}

checkNodeVersion();
const args = processArguments(process.argv);

await enjoy(args);
