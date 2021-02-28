import knex from '../src/utils/knex';
import {getArgs} from './utils';

(async function() {
  const args = getArgs();
  const where = {};
  if (args.length) {
    where.id = args[0];
  }

  const result = await knex('area')
    .where(where)
    .select();
  console.log(result);
  process.exit();
})();
