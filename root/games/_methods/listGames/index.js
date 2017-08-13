/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const { error } = GLOBAL_METHODS.$import('.logger');
  const { noop } = GLOBAL_METHODS.$import('.util');

  GLOBAL_METHODS.$import('fs').readdirSync(`${process.cwd()}/modules/games`)
    .filter(fl => !fl.startWith('.') && fl.endsWith('.js')).map(fl => fl.slice(0, -3))
    .forEach(gm => GLOBAL_APP_CONFIG.$store.write('game', gm, { }).then(noop).catch(error));

  function func(vars, methods, req, res, next) {
    GLOBAL_APP_CONFIG.$store.list('game').then(next);
  }

  return func;
};
