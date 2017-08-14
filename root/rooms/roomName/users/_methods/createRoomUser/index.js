/* eslint no-unused-vars:0 */

module.exports = function MainBlock(GLOBAL_APP_CONFIG, GLOBAL_METHODS, GLOBAL_VARS, GLOBAL_API) {
  const { noop } = global.AppImport('.util');
  const { error } = global.AppImport('.logger');

  const gameMap = {};

  const notifierMap = {};

  function SetOrGetGame(gameName, users, notifier) {
    if (!gameMap[gameName]) {
      gameMap[gameName] = new (global.AppImport(`./games/${gameName}`))(users, notifier);
      gameMap[gameName].once('start', notifier.notifyAll.bind(notifier, 'start'));
      gameMap[gameName].once('end', (winner, actual, max, timesup) => {
        notifier.notifyAll('end', winner, actual, max);
        gameMap[gameName].removeAllListeners('question');
        notifier.removeAllListeners('answer');
      });
      gameMap[gameName].on('score', notifier.notify.bind(notifier, 'score'));
      gameMap[gameName].on('question', notifier.notifyAll.bind(notifier, 'question'));
    }
    return gameMap[gameName];
  }

  function SetOrGetNotifier(roomName) {
    if (!notifierMap[roomName]) {
      notifierMap[roomName] = new (global.AppImport('.socket'))(roomName);
    }
    return notifierMap[roomName];
  }

  async function uponRoomUser(data) {
    const ar = await GLOBAL_APP_CONFIG.$store.list('roomuser');
    const room = await GLOBAL_APP_CONFIG.$store.read('room', data.roomName);
    const notifier = SetOrGetNotifier(data.roomName);
    const game = SetOrGetGame(room.gameName, [], notifier);
    game.addUser(data.userName);
    if (room && ar.length === room.noOfPlayers) {
      game.start();
    }
  }

  function func(vars, methods, req, res, next) {
    const data = {
      userName: vars.currentuser,
      roomName: vars.params.path.roomName,
    };
    GLOBAL_APP_CONFIG.$store.write('roomuser', `${data.userName}_${data.roomName}`, data).then(() => {
      uponRoomUser(data).then(() => next(data)).catch(error);
    }).catch(next.bind(res, 500));
  }

  return func;
};
