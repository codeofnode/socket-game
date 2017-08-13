import EventEmitter from 'events';
import Engine from 'engine.io';

/**
 * An instance of [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}.
 * @typedef {Promise} Promise
 */

/**
 * @module Socket
 */

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
    super();
  }

  /**
   * create or update a document.
   * @param {string} ev - the event to send
   * @param {*} ...data - the infomation to sent via web socket
   */
  notifyAll(ev ...data) {
  }

}

export default Store;
