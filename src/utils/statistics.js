import _ from 'lodash';

function getMedian(inputArray) {
  const middleIdx = inputArray.length / 2;
  if (middleIdx % 1 === 0) {
    return inputArray[middleIdx];
  } else {
    const lowerIdx = Math.floor(middleIdx);
    const upperIdx = lowerIdx + 1;
    return _.mean([inputArray[lowerIdx], inputArray[upperIdx]])
  }
}

function getStdDev(inputArray) {
  const mean = _.mean(inputArray);
  const squareDiffs = _.map(inputArray, val => Math.pow(val - mean,  2));
  const squareDiffsMean = _.mean(squareDiffs);
  return Math.sqrt(squareDiffsMean);
}

export default function(inputArray) {
  const mean = _.mean(inputArray);
  const median = getMedian(inputArray);
  const distribution = _.countBy(inputArray);
  const stdDev = getStdDev(inputArray);
  return {mean, median, distribution, stdDev, count: inputArray.length};
}