/* eslint no-unused-vars:0, global-require:0, import/no-dynamic-require:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const rootDir = `${process.cwd()}/${(GLOBAL_APP_CONFIG && GLOBAL_APP_CONFIG.moduledir) || 'modules'}/`;

  GLOBAL_METHODS.$import = function internalImport(name) { // eslint-disable-line no-param-reassign
    let toRet;
    if (typeof name === 'string') {
      if (['/', '.'].indexOf(name.charAt(0)) === -1) {
        toRet = require(name);
      } else {
        toRet = require(rootDir + name.substring(1));
      }
    } else {
      toRet = require(name);
    }
    return toRet.default ? toRet.default : toRet;
  };

  GLOBAL_APP_CONFIG.$store = // eslint-disable-line no-param-reassign
    new (GLOBAL_METHODS.$import('.store'))(['game', 'user', 'room', 'roomuser']);

  function func() {
  }

  return func;
};
