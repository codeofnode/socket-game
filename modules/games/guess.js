import EventEmitter from 'events';

/**
 * An instance of [Promise]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise}.
 * @typedef {Promise} Promise
 */

/**
 * @module Game_Guess
 */

/**
 * The Guess game class
 * @class
 */
class Guess extends EventEmitter {
  /**
   * Create an instance of Guess game class
   * @param {string[]} users - the list of users participating
   * @param {EventEmitter} notifier - the instance which brings the answer
   */
  constructor(users, notifier) {
    super();
    this.scores = { };
    this.noOfUsers = users.length;
    this.notifyTime = 5;
    this.notifier = notifier;
    users.forEach((us) => {
      this.scores[us] = 0;
    });
  }

  /**
   * Start the game
   */
  start() {
    this.emit('start', this.notifyTime);
    setTimeout(() => {
      this.emit('question', 'Guess the number between from 1 to 26 ?');
      this.actual = Math.floor(Math.random() * 26);
      this.notifier.on('answer', this.handleAnswer.bind(this));
    }, this.notifyTime * 1000);
  }

  /**
   * Answer handler
   * @param {string} user - who answered
   * @param {string} val - the answer
   */
  handleAnswer(user, val) {
    if (typeof this.scores[user] === 'number') {
      const num = parseInt(val, 10);
      if (isNaN(num)) {
        this.scores[user] -= 2;
      } else if (num === this.actual) {
        this.scores[user] += num;
      } else {
        this.scores[user] -= Math.abs(num - this.actual);
      }
      if (this.scores[user] >= 10) {
        this.emit('end', user, this.actual);
      }
    }
  }
}

export default Guess;
