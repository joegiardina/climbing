import {getArgs} from './utils';
import getLogger from '../src/utils/log';
import knex from '../src/utils/knex';
import {scrapeArea} from '../src/lib/mountainProject/scraper';
const log = getLogger('devtools');

(async function() {
  const args = getArgs();
  if (!args.length) {
    log.error('id required');
    process.exit(1);
  }

  await scrapeArea(args[0], {save: true});
  process.exit();
})();