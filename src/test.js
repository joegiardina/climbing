import {scrapeArea as scrape8a} from 'lib/scrapers/8a';
import {scrapeArea as scrapeMP} from 'lib/scrapers/mountainProject';

(async function() {
  // const areaSlug = 'clear-creek-canyon-co';
  // const areaSlug = 'moe-s-valley-ut';
  // await scrape8a(areaSlug, {save: true});

  // const areaId = '106028834'; // moes
  const areaId = '105744243'; // ccc
  await scrapeMP(areaId, {save: true});
})();
