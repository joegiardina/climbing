import _ from 'lodash';
import getLogger from 'utils/log';
import regex from 'utils/regex';
import getStatistics from 'utils/statistics';
import {V_GRADES, V_GRADE_REGEX, FONT_GRADES, FONT_GRADE_REGEX} from './constants';

const log = getLogger('gradeConverter');

function parseGrade(input) {
  const match = regex(V_GRADE_REGEX, input) || regex(FONT_GRADE_REGEX, input);
  if (match) {
    return match.toUpperCase();
  }
}

function isVGrade(input) {
 return V_GRADE_REGEX.test(input);
}

function isFontGrade(input) {
  return FONT_GRADE_REGEX.test(input);
}

function isHardForGrade(value) {
  const decimal = value % 1;
  const index = Math.round(value);
  return decimal > 0.33 && index < value;
}

function isSoftForGrade(value) {
  const decimal = value % 1;
  const index = Math.round(value);
  return decimal < 0.67 && index > value;
}

export function getGradeByIndexValue(value) {
  const index = Math.round(value);

  const vGrade = V_GRADES[index];
  const fontGrade = FONT_GRADES[index];
  const soft = isSoftForGrade(value);
  const hard = isHardForGrade(value);
  return {value, index, vGrade, fontGrade, soft, hard};
}

export function getConsensusGrade(suggestedGrades) {
  const avgSuggested = _.mean(suggestedGrades);
  const statistics = getStatistics(suggestedGrades);
  const {mean, median, stdDev} = statistics;
  const grade = getGradeByIndexValue(mean);
  grade.statistics = statistics;

  return grade;
}

export default function convertGrade(inputGrade) {
  const input = parseGrade(inputGrade);
  if (isVGrade(input)) {
    const range = input.match(/(\d+)-(\d+)/);
    if (range && range.length) {
      const lower = `V${range[1]}`;
      const upper = `V${range[2]}`;
      return parseInt(_.mean([
        _.findIndex(V_GRADES, grade => grade === lower),
        _.findIndex(V_GRADES, grade => grade === upper),
      ]));
    }
    return _.findIndex(V_GRADES, grade => grade === _.trim(input.toUpperCase()));
  }

  if (isFontGrade(input)) {
    return _.findIndex(FONT_GRADES, grade => grade === _.trim(input.toUpperCase()));
  }


  log.error(`unhandled grade input: ${inputGrade}`);
  return -1;
}
