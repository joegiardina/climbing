import axios from 'axios';
import getLogger from './log';
const log = getLogger();

export default async function(url, opts = {}) {
  const {
    method = 'get',
  } = opts;

  log.debug('request: ' + url);
  return await axios[method.toLowerCase()](url);
}
