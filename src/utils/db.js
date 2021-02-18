import _ from 'lodash';
import fs from 'fs';
import cccMp from '../../data/mountainProject/105744243.json';
import ccc8a from '../../data/8a/clear-creek-canyon-co.json';

// TODO: implement some sort of DB instead of fs

export function saveDataLocal(filepath, data) {
  fs.writeFileSync(filepath + '.json', JSON.stringify(data, null, 2), 'utf8');
}

export function searchByName(query) {
  const boulderResultsMp = _.filter(cccMp.boulder, {Route: query});
  const sportResultsMp = _.filter(cccMp.sport, {Route: query});

  const boulderResults8a = _.filter(ccc8a.boulder, {zlaggableName: query});
  const sportResults8a = _.filter(ccc8a.sport, {zlaggableName: query});

  return _.flatten([boulderResults8a, boulderResultsMp, sportResults8a, sportResultsMp]);
}