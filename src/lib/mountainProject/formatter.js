import _ from 'lodash';
import {default as convertGrade, getGradeByIndexValue, getConsensusGrade} from 'lib/gradeConverter';

const inputSchema = {
  // mp fields
  Route: 'string',                   // Dark Horse
  Location: 'string',                // Dark Horse Boulder > Guanella Pass > Georgetown > Colorado
  URL: 'string',                     // https://www.mountainproject.com/route/117068715/dark-horse
  'Avg Stars': 'string',             // 3.9
  'Your Stars': 'string',            // -1
  'Route Type': 'string',            // Boulder, Alpine
  Rating: 'string',                  // V10
  Pitches: 'string',                 // 1
  Length: 'string',                  // 20
  'Area Latitude': 'string',         // 39.66455
  'Area Longitude': 'string',        // -105.70464

  // custom fields
  id: 'string',                      // 117068715
  type: 'string',                    // boulder
  name: 'string',                    // Dark Horse
  ticks: '{}[]',                     // [{name, date, comment}]
  suggestedRatings: '{}[]',          // [{name, grade}]
  starRatings: '{}[]',               // [{name, stars}]
};

const MAX_STARS = 4;
function getStarRatings(input) {
  const {starRatings} = input;
  const ratings = _.map(starRatings, rating => rating.stars / MAX_STARS * 100);
  return ratings;
}

function getSuggestedGrades(input) {
  const {suggestedRatings} = input;
  const suggestedGrades = _.map(suggestedRatings, rating => convertGrade(rating.grade));
  _.pull(suggestedGrades, -1);
  return suggestedGrades;
}

export default function format(input) {
  const {
    id,
    type,
    name
  } = input;

  const starRatings = getStarRatings(input);
  const avgStarRating = _.mean(starRatings);
  const suggestedGrades = getSuggestedGrades(input);
  const grade = getConsensusGrade(suggestedGrades);

  return {
    id,
    type,
    name,
    starRatings,
    avgStarRating,
    suggestedGrades,
    grade,
  };
}
