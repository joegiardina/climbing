import _ from 'lodash';
import {default as convertGrade, getGradeByIndexValue, getConsensusGrade} from 'lib/gradeConverter';

const inputSchema = {
  "zlaggableName": 'string',            // "Animal",
  "zlaggableSlug": 'string',            // "animal",
  "cragSlug": 'string',                 // "unknown-crag-99e5e-verrev",
  "cragName": 'string',                 // "Unknown Crag",
  "countrySlug": 'string',              // "united-states",
  "countryName": 'string',              // "United States",
  "areaSlug": 'string',                 // "clear-creek-canyon-co",
  "areaName": 'string',                 // "Clear Creek Canyon (CO)",
  "sectorSlug": 'string',               // "unknown-sector",
  "sectorName": 'string',               // "Unknown Sector",
  "category": 'number',                 // 1,
  "difficulty": 'string',               // "7C",
  "gradeIndex": 'number',               // 27,
  "totalAscents": 'number',             // 103,
  "totalRecommendedRate": 'number',     // 0.0582524277,
  "averageRating": 'number',            // 3.2143,
  "flashOnsightRate": 'number',         // 0.116504855,
  "userClimbed": 'boolean',             // false,
  "userClimbedInfo": 'unknown',         // null,
  "hasVlId": 'boolean',                 // false,

  // custom fields
  "details": {
    "zlaggableName": "Animal",
    "zlaggableSlug": "animal",
    "cragSlug": "unknown-crag-99e5e-verrev",
    "cragName": "Unknown Crag",
    "countrySlug": "united-states",
    "countryName": "United States",
    "sectorSlug": "unknown-sector",
    "sectorName": "Unknown Sector",
    "category": 1,
    "difficulty": "7C",
    "areaSlug": "clear-creek-canyon-co",
    "areaName": "Clear Creek Canyon (CO)",
    "averageRating": 3.2143,
    "totalAscents": 103,
    "onsightRate": 0.009708738,
    "totalRecommended": 6,
    "season": ['number'],
    "gradeIndex": 27,
    "grades": {
      "24": 1,
      "25": 1,
      "26": 17,
      "27": 47,
      "28": 35,
      "29": 2
    },
    "totalRedpoint": 90,
    "totalOnsight": 1,
    "totalFlash": 11,
    "totalGo": 1,
    "totalTopRope": 0,
    "totalFollowers": 0
  },
  "ascents": [
    {
      "userAvatar": null,
      "userName": "Ross Cooper",
      "userSlug": "ross-cooper",
      "date": "2020-11-19T12:00:00+00:00",
      "difficulty": "7C",
      "isHard": false,
      "isSoft": false,
      "type": "rp",
      "comment": "",
      "traditional": false,
      "project": false,
      "rating": 0,
      "userPrivate": false,
      "zlagGradeIndex": 27,
      "zlaggableName": "Animal",
      "zlaggableSlug": "animal",
      "cragSlug": "unknown-crag-99e5e-verrev",
      "cragName": "Unknown Crag",
      "countrySlug": "united-states",
      "countryName": "United States",
      "areaSlug": "clear-creek-canyon-co",
      "areaName": "Clear Creek Canyon (CO)",
      "sectorSlug": "unknown-sector",
      "sectorName": "Unknown Sector",
      "category": 1,
      "recommended": false,
      "firstAscent": false,
      "secondGo": false,
      "isBoltedByMe": false,
      "isOverhang": false,
      "isVertical": false,
      "isSlab": false,
      "isRoof": false,
      "isAthletic": false,
      "isEndurance": false,
      "isCrimpy": false,
      "isCruxy": false,
      "isSloper": false,
      "isTechnical": false,
      "isDanger": false,
      "chipped": false,
      "badAnchor": false,
      "badBolts": false,
      "highFirstBolt": false,
      "looseRock": false,
      "badClippingPosition": false
    }
  ]
};

const MAX_STARS = 5;
function getStarRatings(input) {
  const {ascents} = input;
  const ratings = _.map(ascents, ascent => ascent.rating / MAX_STARS * 100);
  _.pull(ratings, 0);
  return ratings;
}

function getSuggestedGrades(input) {
  const {ascents} = input;
  const suggestedGrades = _.map(ascents, ascent => convertGrade(ascent.difficulty));
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
