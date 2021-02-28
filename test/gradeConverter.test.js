import _ from 'lodash';
import {default as convertGrade, getGradeByIndexValue} from '../src/lib/gradeConverter';

const INPUT = [
  'V6',
  'V6',
  'V6',
  'V6',
  'V6',
  'V6',
  'V7',
  'V7',
  'V8-',
  'V7-',
];

(function() {
  const input = INPUT;
  const converted = _.map(input, grade => convertGrade(grade));
  console.log(converted);
  const avg = _.mean(converted);
  const result = getGradeByIndexValue(avg);
  console.log(result);
})()