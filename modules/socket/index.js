import EventEmitter from 'events';
import Engine from 'socket.io';

/**
 * An instance of [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}.
 * @typedef {Promise} Promise
 */

/**
 * @module Socket
 */

let SERVER;

/**
 * The Store class
 * @class
 */

class Store extends EventEmitter {
  /**
   * Create an instance of Store class
   * @param {string[]} collections - the list of collections
   */
  constructor(roomName) {
    if (!SERVER) throw new Error('Please make sure to call `setServer` method first.');
    super();
    this.room = SERVER.of(`/${roomName}`);
    this.room.on('connection', this.handleSocket.bind(this));
  }

  /**
   * setting up the server
   * @param {http.Server} server - the http's server's instance
   */
  static setServer(server) {
    if (!SERVER) SERVER = Engine(server);
  }

  /**
   * handling the socket connection
   * @param {Socket} socket - the socket recieved
   */
  handleSocket(socket) {
    socket.on('answer', (ans) => {
      this.emit('answer', socket.user, ans);
    });
  }

  /**
   * create or update a document.
   * @param {string} ev - the event to send
   * @param {*} ...data - the infomation to sent via web socket
   */
  notifyAll(ev, ...data) {
    this.room.emit(ev, ...data);
  }

  /**
   * remove the events before removing the instance
   * @param {string} ev - the event to send
   */
  removeAllListeners(ev) {
    super.removeAllListeners(ev);
    SERVER.removeAllListeners('connection');
  }

}

export default Store;
