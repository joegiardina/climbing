import validateSchema from '../src/utils/validateSchema';

(function() {
  validateSchema({id: 'string', val: ['number'], strs: ['string']}, {id: '123', val: [123], strs: ['1']});
})();
