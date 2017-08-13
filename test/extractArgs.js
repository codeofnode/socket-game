import assert from 'assert'
import main from '../modules/extractArgs'

describe('extract argument', () => {
  describe('options', () => {
    it('should be extracted', (done) => {
      assert.deepEqual(main, { loglevel: 1 });
      done();
    })
  });
})
