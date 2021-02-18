import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import {saveDataLocal} from 'utils/db';
import {SPORT, BOULDER} from 'utils/constants';
import getLogger from 'utils/log';
import getApiRequester from 'utils/apiRequester';

const CLIMB_TYPE_MAP = {
  [SPORT]: 'sportclimbing',
  [BOULDER]: 'bouldering',
};

const BASE_URL = 'https://www.8a.nu/api';
const BASE_FILEPATH = path.join(__dirname, '../../../data/8a/');
const PAGE_SIZE = 1000;
const CONCURRENCY = 50;

const log = getLogger('8a scraper');
const apiRequest = getApiRequester(BASE_URL);

async function saveData(areaId, data) {
  if (!fs.existsSync(BASE_FILEPATH)) {
    fs.mkdirSync(BASE_FILEPATH);
  }
  const filepath = path.join(BASE_FILEPATH, areaId);
  saveDataLocal(filepath, data);
}

async function apiRequestWithPagination(inputUrl) {
  let pageIndex = 0;
  let result = [];

  let pagination = {hasNext: true};
  while (pagination.hasNext) {
    log.debug(`getting ${inputUrl} page ${pageIndex}`);
    const url = inputUrl.replace(/pageIndex=\d+/, `pageIndex=${pageIndex}`);
    const resp = await apiRequest(url);
    pagination = resp.data.pagination;
    result = result.concat(resp.data.items);
    pageIndex++;
  }

  return result;
}

function getClimbDetailsUrl({cragSlug, sectorSlug, zlaggableSlug}, type) {
  return `/crags/${CLIMB_TYPE_MAP[type]}/united-states/${cragSlug}/sectors/${sectorSlug}/routes/${zlaggableSlug}`;
}

async function getAscentsForClimb(climb, type) {
  const climbDetailsUrl = getClimbDetailsUrl(climb, type);
  const url = `${climbDetailsUrl}/ascents?pageSize=${PAGE_SIZE}&pageIndex=0`;
  return await apiRequestWithPagination(url);
}

async function getClimbDetailsByType(climb, type) {
  const {cragSlug, sectorSlug, zlaggableSlug} = climb;
  log.debug(`getting details for ${type} ${zlaggableSlug}`);

  const url = getClimbDetailsUrl(climb, type);

  const [detailsResp, ascents] = await Promise.all([
    apiRequest(url),
    getAscentsForClimb(climb, type),
  ]);

  const details = detailsResp.data.zlaggable;
  return {details, ascents};
}

async function flushClimbsWithData(climbs, type) {
  log.info(`flushing ${climbs.length} ${type} climbs with data`);
  await Promise.map(climbs, async climb => {
    const {details, ascents} = await getClimbDetailsByType(climb, type);
    climb.details = details;
    climb.ascents = ascents;
  }, {concurrency: CONCURRENCY});
}

async function getClimbsByType(areaSlug, type) {
  const url = `/areas/united-states/${areaSlug}/${CLIMB_TYPE_MAP[type]}/zlaggables?pageSize=${PAGE_SIZE}&pageIndex=0`;
  return await apiRequestWithPagination(url);
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

export async function scrapeArea(areaSlug, {save = false} = {}) {
  log.info(`scraping area ${areaSlug}`);

  const climbs = await getClimbsForArea(areaSlug);
  const promises = _.map(climbs, flushClimbsWithData);
  await Promise.all(promises);

  if (save) {
    log.info(`saving area ${areaSlug}`);
    saveData(areaSlug, climbs);
    log.info(`done saving area ${areaSlug}`);
  }

  log.info(`done scraping area ${areaSlug}`);
  return climbs;
}
