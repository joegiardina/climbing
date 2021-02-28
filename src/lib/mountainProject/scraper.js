import _ from 'lodash';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import csvParse from 'csv-parse/lib/sync';
import {saveData as _saveData} from 'utils/db';
import {SPORT, BOULDER, CLIMB, AREA, CRAG} from 'utils/constants';
import getLogger from 'utils/log';
import getApiRequester from 'utils/apiRequester';

import format from './formatter';

const CLIMB_TYPE_MAP = {
  [SPORT]: 'rock',
  [BOULDER]: 'boulder',
};

const BASE_URL = 'https://www.mountainproject.com';
const BASE_FILEPATH = path.join(__dirname, '../../../data/mountainProject/');
const PAGE_SIZE = 1000;
const CONCURRENCY = 10;

const log = getLogger('Mountain Project scraper');
const apiRequest = getApiRequester(BASE_URL);

async function saveData(table, data) {
  data.source = 'mountainProject';
  return await _saveData({table, data});
}

async function flushClimbWithDetails(climb, type) {
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

  climb.id = routeId;
  climb.type = type;
  climb.name = Route;
  climb.ticks = ticks;
  climb.suggestedRatings = suggestedRatings;
  climb.starRatings = starRatings;
  return climb;
}

async function getClimbsForAreaByType(id, type) {
  const csv = await getCSVForArea(id, type);
  return csvParse(csv, {columns: true}) || [];
}

async function processClimbsByType(climbs, type) {
  log.debug(`flushing ${climbs.length} ${type} climbs with data`);
  await Promise.map(
    climbs,
    async climb => {
      const climbWithDetails = await flushClimbWithDetails(climb, type);
      const formatted = format(climbWithDetails);
      log.debug(`saving climb ${climb.name}`);
      await saveData(CLIMB, formatted);
    },
    {concurrency: CONCURRENCY},
  );
}

async function processClimbs(climbs) {
  const promises = _.map(climbs, processClimbsByType);
  await Promise.all(promises);
}

async function getCSVForArea(id, type) {
  const url = `/route-finder-export?selectedIds=${id}&type=${CLIMB_TYPE_MAP[type]}&diffMinrock=1000&diffMinboulder=20000&diffMinaid=70000&diffMinice=30000&diffMinmixed=50000&diffMaxrock=12400&diffMaxboulder=21700&diffMaxaid=75260&diffMaxice=38500&diffMaxmixed=60000&is_trad_climb=1&is_sport_climb=1&is_top_rope=1&stars=0&pitches=0&sort1=area&sort2=rating`;
  const resp = await apiRequest(url);
  return resp.data;
}

async function getClimbsForArea(id) {
  const [sport, boulder] = await Promise.all([
    getClimbsForAreaByType(id, SPORT),
    getClimbsForAreaByType(id, BOULDER),
  ]);

  return {
    [SPORT]: sport,
    [BOULDER]: boulder,
  };
}

export function getSubAreas($) {
  const subAreas = $('h3:contains(Areas in) + div + div a')
    .map((i, el) => {
      const $el = $(el);
      const url = $el.attr('href');
      const name = $el.text();
      const id = url.match(/(\d+)/i)[1];
      return {id, name, url};
    })
    .get();
  return subAreas;
}

function getAreaName($) {
  return $('#single-area-picker-name').text();
}

async function getAreaHtml(id) {
  const url = `/area/${id}`;
  const resp = await apiRequest(url);
  return resp.data;
}

export async function getStates() {
  const resp = await apiRequest('/route-guide');
  const $ = cheerio.load(resp.data);
  const routeGuide = $('#route-guide');
  const states = $('strong a', routeGuide)
    .map((i, el) => {
      const $el = $(el);
      const url = $el.attr('href');
      const name = $el.text();
      const id = url.match(/(\d+)/i)[1];
      return {id, name, url};
    })
    .get();
  return states;
}

export async function scrapeArea(id, options = {}) {
  const {save = false} = options;

  const areaHtml = await getAreaHtml(id);
  const $ = cheerio.load(areaHtml);

  const area = {
    id,
    name: getAreaName($),
  };

  log.info(`scraping area ${area.name}`);

  // check if this is an "area" or "crag"
  const subAreas = await getSubAreas($);
  if (subAreas.length) {
    const subAreaIds = _.map(subAreas, 'id');

    area.type = AREA;
    area.subAreaIds = subAreaIds;
    if (save) {
      log.debug(`saving area ${area.name}`);
      saveData(AREA, area);
    }

    await Promise.map(
      subAreaIds,
      id => scrapeArea(id, options),
      {concurrency: CONCURRENCY},
    );

    log.info(`done scraping area ${area.name}`);
    return area;
  }

  const climbs = await getClimbsForArea(id);
  await processClimbs(climbs);

  area.type = CRAG;
  area.climbIds = {};
  area.climbIds.sport = _.map(climbs[SPORT], 'id');
  area.climbIds.boulder = _.map(climbs[BOULDER], 'id');

  if (save) {
    log.debug(`saving area ${area.name}`);
    saveData(AREA, area);
  }

  log.info(`done scraping area ${area.name}`);
  return area;
}

export async function scrapeState(state, options = {}) {
  log.info(`Starting scraper for ${state.name}`);
  const start = Date.now();
  const stateData = await scrapeArea(state.id, options);
  stateData.is_state = true;
  if (options.save) {
    log.debug(`saving state ${state.name}`);
    saveData(AREA, stateData);
  }
  const duration = Date.now() - start;
  log.info(`Done scraping ${state.name} in ${duration / 1000} sec`);
}

export async function scrapeStates(options = {}) {
  const states = await getStates();
  await Promise.each(states, state => scrapeState(state, options));
}
