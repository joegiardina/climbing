import _ from 'lodash';
import Promise from 'bluebird';
import fs from 'fs';
import getLogger from './log';
import request from './request';
import knex from './knex'
const log = getLogger();

const DB = process.env.DB || 'local';
const DYNAMO_DB_API_BASE_URL = process.env.DYNAMO_DB_API_BASE_URL;

async function saveDataDb(table, input) {
  const picked = _.pick(input, 'id', 'name', 'type', 'source');
  picked.raw = JSON.stringify(input);
  const existing = await knex(table)
    .where({id: input.id})
    .select();

  if (existing.length) {
    return knex(table)
      .where({id: input.id})
      .update(picked);
  }

  return knex(table).insert(picked);
}

export async function getDataDynamo() {
  const URL = `${DYNAMO_DB_API_BASE_URL}/items`;
  const resp = await request(URL);
  return resp.data;
}

async function saveDataDynamo(data) {
  const URL = `${DYNAMO_DB_API_BASE_URL}/items`;
  const resp = await request(URL, {method: 'PUT', data});
  if (resp.status !== 200) {
    log.error('saveDataDynamo err: ' + JSON.stringify(resp.data));
  }
  return resp.data;
}

export function saveData({table, data}) {
  if (DB === 'dynamo' && DYNAMO_DB_API_BASE_URL) {
    return saveDataDynamo(data);
  } else if (DB === 'local') {
    return saveDataDb(table, data);
  }
}
