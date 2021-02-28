import {getArgs} from './utils';
import knex from '../src/utils/knex';
import getLogger from '../src/utils/log';
const log = getLogger('devtools');

(async function() {
  const args = getArgs();
  if (!args.length) {
    log.error('id required');
    process.exit(1);
  }

  const result = await knex('climb')
    .where({id: args[0]})
    .select();
  console.log(result);
  process.exit();
})();