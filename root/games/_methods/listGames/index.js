/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  function func(vars, methods, req, res, next) {
    GLOBAL_APP_CONFIG.$store.list('game').then(next)
  }
  return func;
};
