/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  function func(vars, methods, req, res) {
    GLOBAL_APP_CONFIG.$store.write('roomuser', 0, {
      userName: vars.user,
      roomName: vars.params.path.roomName,
    }).then(next);
  }
  return func;
};
