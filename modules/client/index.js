import io from 'socket.io-client';
import promisify from 'util.promisify';
import j2s from 'json2server';
import configJson from '../../j2c.json'; // eslint-disable-line import/no-unresolved
import pkg from '../../package.json';

const APIurl = `${configJson.connectionUrl}/${pkg.version.split('.').shift()}/`;

const request = promisify(j2s.methods.request);

process.stdout.write('Welcome,\nPlease enter your name : ');

let UserName;
let GameName;
let RoomName;
let Games;
let Socket;
let Answer;

function playWithSocket() {
  Socket = io(`${configJson.connectionUrl}/${RoomName}`);
  Socket.on('connect', () => process.stdout.write('Great, We are connected now.'));
  Socket.on('start', int => process.stdout.write(`Get Ready, A question will be asked in ${int} seconds.`));
  Socket.on('question', qs => process.stdout.write(qs));
  Socket.on('end', (winner, act) => {
    process.stdout.write(`Winner : ${winner}, Actual Number : ${act} \n Cheers.`);
  });
  Socket.on('disconnect', () => process.stdout.write('By By'));
}

async function SelectGame() {
  try {
    const resp = await request({
      url: `${APIurl}rooms`,
      method: 'POST',
      payload: { gameName: GameName, roomName: RoomName },
      headers: { 'x-user': UserName },
    });
    process.stdout.write(`Awesome, awaiting for ${resp.parsed.noOfPlayers} users to join this game.`);
    playWithSocket();
  } catch (er) {
    throw er;
  }
}

async function createUser(name) {
  try {
    UserName = name;
    await request({
      url: `${APIurl}users`,
      method: 'POST',
      payload: { username: UserName },
    });
    process.stdout.write(`Great kick, ${UserName}, Please select a game now (a integer value) : `);
    Games = await request({ url: `${APIurl}/games` }).parsed;
    Games.forEach((gm, ind) => process.stdout.write(`${ind}. ${gm}\n`));
  } catch (er) {
    throw er;
  }
}

function main(input) {
  const data = input.trim();
  if (data) {
    if (!UserName) {
      return createUser(data);
    }
    if (!GameName) {
      GameName = Games[Number(data)];
      RoomName = GameName; // let's consider for sake of experiment
      SelectGame();
    }
    Answer = Number(data);
    Socket.send('answer', Answer);
  }
  return undefined;
}

process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', main).once('end', process.exit.bind(0));
