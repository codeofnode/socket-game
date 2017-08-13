import EventEmitter from 'events';

/**
 * An instance of [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}.
 * @typedef {Promise} Promise
 */

/**
 * @module Store
 */

const ID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ID_CHARS_LEN = ID_CHARS.length;

/**
 * The Store class
 * @class
 */
class Store extends EventEmitter {
  /**
   * Create an instance of Store class
   * @param {string[]} collections - the list of collections
   */
  constructor(collections) {
    super();
    this.data = { };
    collections.forEach((cl) => {
      this.data[cl] = {};
    });
  }

  /**
   * generate a random id
   * @return {string} text - return random string id
   */
  static GenId() {
    let text = String((new Date()).getTime());
    for (let i = 0; i < 5; i += 1) {
      text += ID_CHARS.charAt(Math.floor(Math.random() * ID_CHARS_LEN));
    }
    return text;
  }

  /**
   * list all the entries
   * @param {string} coll - the collection, that should be read
   * @return {Promise} promise - return a promise
   */
  list(coll) {
    return new Promise((res) => {
      res(Object.keys(this.data[coll]));
    });
  }

  /**
   * list all the collections.
   * @return {Promise} promise - return a promise
   */
  listcolls() {
    return new Promise((res) => {
      res(Object.keys(this.data));
    });
  }

  /**
   * read a document.
   * @param {string} coll - the collection, that should be read
   * @param {string} docid - the document id, that should be read
   * @return {Promise} promise - return a promise
   */
  read(coll, docid) {
    return new Promise((res) => {
      const cont = this.data[coll][docid];
      res(cont);
      this.emit('R', coll, docid, cont);
    });
  }

  /**
   * create or update a document.
   * @param {string} coll - the collection, that should be read
   * @param {string} docid - the doc id at which, that should be created/updated
   * @param {object} data - the content in to write
   * @return {Promise} promise - return a promise
   */
  write(coll, docid, data) {
    return new Promise((res) => {
      const isNew = !docid;
      const dcid = docid || Store.GenId();
      this.data[coll][dcid] = data;
      res(dcid);
      this.emit(isNew ? 'W' : 'U', coll, docid, data);
    });
  }

  /**
   * delete a document.
   * @param {string} coll - the collection, that should be read
   * @param {string} docid - the doc id at which, that should be deleted
   * @return {Promise} promise - return a promise
   */
  del(coll, docid) {
    return new Promise((res) => {
      delete this.data[coll][docid];
      res(docid);
      this.emit('D', coll, docid);
    });
  }

  /**
   * create a collection.
   * @param {string} coll - the new collection, that should be created
   * @return {Promise} promise - return a promise
   */
  mkcoll(coll) {
    return new Promise((res) => {
      this.data[coll] = {};
      res(coll);
    });
  }

  /**
   * remove a collection.
   * @param {string} coll - the collection name that should be deleted
   * @return {Promise} promise - return a promise
   */
  rmcoll(coll) {
    return new Promise((res) => {
      delete this.data[coll];
      res(coll);
    });
  }
}

export default Store;
