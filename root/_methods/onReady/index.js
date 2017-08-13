/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  function func(server) {
    GLOBAL_METHODS.$import('.socket').setServer(server); // eslint-disable-line no-param-reassign
  }

  return func;
};
