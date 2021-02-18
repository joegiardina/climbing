import _ from 'lodash';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import csvParse from 'csv-parse/lib/sync';
import {saveDataLocal} from 'utils/db';
import {SPORT, BOULDER} from 'utils/constants';
import getLogger from 'utils/log';
import getApiRequester from 'utils/apiRequester';

const CLIMB_TYPE_MAP = {
  [SPORT]: 'rock',
  [BOULDER]: 'boulder',
};

const BASE_URL = 'https://www.mountainproject.com';
const BASE_FILEPATH = path.join(__dirname, '../../../data/mountainProject/');
const PAGE_SIZE = 1000;
const CONCURRENCY = 50;

const log = getLogger('Mountain Project scraper');
const apiRequest = getApiRequester(BASE_URL);

async function saveData(areaId, data) {
  if (!fs.existsSync(BASE_FILEPATH)) {
    fs.mkdirSync(BASE_FILEPATH);
  }
  const filepath = path.join(BASE_FILEPATH, areaId);
  saveDataLocal(filepath, data);
}

async function getClimbDetailsByType(climb, type) {
  const {Route, URL} = climb;
  log.debug(`getting details for ${type} ${Route}`);

  const routeId = URL.match(/route\/(\d+)/)[1];
  const url = `/route/stats/${routeId}`;
  const statsResp = await apiRequest(url);
  const $ = cheerio.load(statsResp.data);

  const ticks = $('h3:contains(Ticks) + table tr')
    .map((i, el) => {
      const text = $(el).text();
      const [name, date, comment] = _.chain(text)
        .split('\n')
        .map(_.trim)
        .compact()
        .value();
      return {name, date, comment};
    })
    .get();

  const suggestedRatings = $('h3:contains(Suggested Ratings) + table tr')
    .map((i, el) => {
      const text = $(el).text();
      const [name, grade] = _.chain(text)
        .split('\n')
        .map(_.trim)
        .compact()
        .value();
      return {name, grade};
    })
    .get();

  const starRatings = $('h3:contains(Star Ratings) + table tr')
    .map((i, el) => {
      const text = $(el).text();
      const [name] = _.chain(text)
        .split('\n')
        .map(_.trim)
        .compact()
        .value();
      const stars = $('img', el).length;
      return {name, stars};
    })
    .get();

  return {ticks, suggestedRatings, starRatings};
}

async function getClimbsByType(areaId, type) {
  const csv = await getCSVForArea(areaId, type);
  return csvParse(csv, {columns: true}) || [];
}

async function flushClimbsWithData(climbs, type) {
  log.info(`flushing ${climbs.length} ${type} climbs with data`);
  await Promise.map(climbs, async climb => {
    const {ticks, suggestedRatings, starRatings} = await getClimbDetailsByType(climb, type);
    climb.ticks = ticks;
    climb.suggestedRatings = suggestedRatings;
    climb.starRatings = starRatings;
  }, {concurrency: CONCURRENCY});
}

async function getCSVForArea(areaId, type) {
  const url = `/route-finder-export?selectedIds=${areaId}&type=${CLIMB_TYPE_MAP[type]}&diffMinrock=1000&diffMinboulder=20000&diffMinaid=70000&diffMinice=30000&diffMinmixed=50000&diffMaxrock=12400&diffMaxboulder=21700&diffMaxaid=75260&diffMaxice=38500&diffMaxmixed=60000&is_trad_climb=1&is_sport_climb=1&is_top_rope=1&stars=0&pitches=0&sort1=area&sort2=rating`;
  const resp = await apiRequest(url);
  return resp.data;
}

async function getClimbsForArea(areaSlug) {
  const [sport, boulder] = await Promise.all([
    getClimbsByType(areaSlug, SPORT),
    getClimbsByType(areaSlug, BOULDER),
  ]);
  return {
    [SPORT]: sport,
    [BOULDER]: boulder,
  };
}

export async function scrapeArea(areaId, {save = false} = {}) {
  log.info(`scraping area ${areaId}`);

  const climbs = await getClimbsForArea(areaId);
  const promises = _.map(climbs, flushClimbsWithData);
  await Promise.all(promises);

  if (save) {
    log.info(`saving area ${areaId}`);
    saveData(areaId, climbs);
    log.info(`done saving area ${areaId}`);
  }

  log.info(`done scraping area ${areaId}`);
  return climbs;
}
