/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  function func(vars, methods, req, res) {
    GLOBAL_APP_CONFIG.$store.write('room', vars.params.body.roomName, {
      createdBy: vars.user.username,
      gameName: vars.body.gameName,
    }).then(next);
  }
  return func;
};
