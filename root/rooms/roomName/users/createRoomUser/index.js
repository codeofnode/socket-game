/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const { noop } = GLOBAL_METHODS.$import('.util');
  const { error } = GLOBAL_METHODS.$import('.logger');

  async function uponRoomUser(data) {
    const ar = await GLOBAL_APP_CONFIG.$store.list('roomuser');
    const room = await GLOBAL_APP_CONFIG.$store.read('room', data.roomName);
    if (room && ar.length === room.noOfPlayers) {
      const users =
        (await Promise.all(ar.map(rm => GLOBAL_APP_CONFIG.$store.read('roomuser', rm))))
        .map(us => us.userName);
      const notifier = new GLOBAL_METHODS.$import('.socket')(data.roomName);
      const game = new GLOBAL_METHODS.$import(`./games/${room.gameName}`)(users, notifier);
      game.once('start', notifier.notifyAll.bind(notifier, 'start'));
      game.once('end', (winner, actual) => {
        notifier.notifyAll('end', winner, actual);
        game.removeAllListeners('question');
        notifier.removeAllListeners('answer');
      });
      game.on('question', notifier.notifyAll.bind(notifier, 'question'));
    }
  }

  function func(vars, methods, req, res, next) {
    const data = {
      userName: vars.user,
      roomName: vars.params.path.roomName,
    };
    GLOBAL_APP_CONFIG.$store.write('roomuser', 0, data).then(() => {
      next(data);
      uponRoomUser(data).then(noop).catch(error);
    }).catch(next.bind(res, 500));
  }

  return func;
};
