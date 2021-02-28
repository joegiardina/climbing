import _ from 'lodash';

export default function validateSchema(schema, obj) {
  _.forEach(schema, (expectedType, key) => {
    let objValue = _.get(obj, key);
    let objValueType = typeof objValue;

    if (_.isArray(expectedType)) {
      if (_.isArray(objValue)) {
        _.forEach(objValue, value => {
          const valueType = typeof value;
          if (valueType !== expectedType[0]) {
            throw new Error(`schema error: expected '${expectedType[0]}' for element of array in ${key} but got '${valueType}'`);
          }
        });
      } else {
        throw new Error(`schema error: expected '[${expectedType[0]}]' for ${key} but got '${objValueType}'`);
      }
      return true;
    }

    if (objValueType !== expectedType) {
      throw new Error(`schema error: expected '${expectedType}' for ${key} but got '${objValueType}'`);
    }

    return true;
  });
}