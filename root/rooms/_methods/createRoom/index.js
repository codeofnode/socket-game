/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const noOfPlayers = GLOBAL_APP_CONFIG.noOfPlayers || 2;

  function func(vars, methods, req, res, next) {
    const data = {
      createdBy: vars.currentuser,
      noOfPlayers,
      gameName: vars.params.body.gameName,
    };
    GLOBAL_APP_CONFIG.$store.write('room', vars.params.body.roomName, data)
      .then(() => next(data))
      .catch(er => next(er.message, 500));
  }

  return func;
};
