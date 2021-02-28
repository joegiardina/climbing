import {scrapeArea, getAreaList, getSubAreas, getStates, scrapeState} from 'lib/mountainProject/scraper';
import {saveDataDb, getDataDynamo, saveDataDynamo} from 'utils/db';
import knex from 'utils/knex';
import gradeConverter, {getGradeByIndexValue} from 'lib/gradeConverter';

(async function() {
  await scrapeArea('105744225', {save: true});

  // console.log(getGradeByIndexValue(gradeConverter('v8')));

  // console.log(await getDataDynamo());
  // console.log(await saveDataDynamo({id: '123456345345', name: 'a', otherField: 'b'}));
})();
