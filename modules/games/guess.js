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
    this.totalTime = 15;
    this.notifier = notifier;
    users.forEach((us) => {
      this.scores[us] = 0;
    });
  }

  /**
   * Add a user
   * @param {string} username - the username of user to be added
   */
  addUser(username) {
    if (this.scores[username] === undefined) {
      this.noOfUsers += 1;
    }
    this.scores[username] = 0;
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
    setTimeout(this.evaluateAndEnd.bind(this, true), this.totalTime * 1000);
  }

  /**
   * scores evaluation
   * @param {boolean} timesup - if triggered upon timesup
   */
  evaluateAndEnd(timesUp) {
    if (!this.ended) {
      this.ended = true;
      let max;
      let user;
      for (let ky in this.scores) {
        if (max === undefined) {
          max = this.scores[ky];
          user = ky;
        } else {
          if (this.scores[ky] > max) {
            user = ky;
            max = this.scores[ky];
          }
        }
        this.emit('score', ky, this.scores[ky], timesUp);
      }
      this.emit('end', user, this.actual, max, timesUp);
    }
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
        return this.evaluateAndEnd();
      } else {
        this.scores[user] -= Math.abs(num - this.actual);
      }
    }
  }
}

export default Guess;
