/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const { error } = global.AppImport('.logger');
  const { noop } = global.AppImport('.util');

  global.AppImport('fs').readdirSync(`${process.cwd()}/modules/games`)
    .filter(fl => !fl.startsWith('.') && fl.endsWith('.js')).map(fl => fl.slice(0, -3))
    .forEach(gm => GLOBAL_APP_CONFIG.$store.write('game', gm, { }).then(noop).catch(error));

  function func(vars, methods, req, res, next) {
    GLOBAL_APP_CONFIG.$store.list('game').then(next);
  }

  return func;
};
