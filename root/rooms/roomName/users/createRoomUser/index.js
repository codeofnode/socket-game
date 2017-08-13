/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const { noop } = GLOBAL_METHODS.$import('.util');
  const { error } = GLOBAL_METHODS.$import('.logger');

  const noOfPlayers = GLOBAL_APP_CONFIG.noOfPlayers || 2;

  async function uponRoomUser(col, data) {
    const ar = await GLOBAL_APP_CONFIG.$store.list(col);
    if (ar.length === noOfPlayers) {
      const room = await GLOBAL_APP_CONFIG.$store.read('room', data.roomName);
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

  GLOBAL_APP_CONFIG.$store.on('W', (col, id, data) => {
    if (col === 'roomuser') {
      uponRoomUser(col, data).then(noop).catch(error);
    }
  });

  GLOBAL_APP_CONFIG.$store.on('D', (col, id) => {
  });

  function func(vars, methods, req, res) {
    GLOBAL_APP_CONFIG.$store.write('roomuser', 0, {
      userName: vars.user,
      roomName: vars.params.path.roomName,
    }).then(next);
  }

  return func;
};
