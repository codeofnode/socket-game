/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  function func(vars, methods, req, res) {
    return Boolean(GLOBAL_METHODS.isAlphaNum(vars.params.body.roomName));
  }
  return func;
};
