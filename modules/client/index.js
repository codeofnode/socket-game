import io from 'socket.io-client';
import promisify from 'util.promisify';
import j2s from 'json2server';
import configJson from '../../j2c.json'; // eslint-disable-line import/no-unresolved
import pkg from '../../package.json';

const APIurl = `${configJson.connectionUrl}/v${pkg.version.split('.').shift()}/`;

const request = promisify(j2s.methods.request);

process.stdout.write('Welcome,\nPlease enter your name : ');

let UserName;
let GameName;
let RoomName;
let Games;
let Socket;
let Answer;

function playWithSocket() {
  Socket = io(`${configJson.connectionUrl}/${RoomName}`,
    { transportOptions: { polling: { extraHeaders: { 'x-user': UserName } } } });
  Socket.on('connect', () => process.stdout.write('\nGreat, We are connected now.'));
  Socket.on('start', int => process.stdout.write(`\nHeads Up, Get Ready, Wait is over. We got the users. A question will be asked in ${int} seconds.`));
  Socket.on('question', qs => process.stdout.write(`\n${qs}\n`));
  Socket.on('score', (score, timesup) => {
    if (timesup) {
      process.stdout.write('Times up!');
    }
    process.stdout.write(`\nYour Score : ${score}.`);
  });
  Socket.on('end', (winner, act, max) => {
    process.stdout.write(`\nWinner : ${winner}, Actual Number : ${act} \n`);
    process.stdout.write(`\nMax Score : ${max} \n Cheers.`);
  });
  Socket.on('disconnect', () => {
    process.stdout.write('\nBy By\n');
    process.exit(0);
  });
}

async function SelectGame() {
  const resp = (await request({
    url: `${APIurl}rooms`,
    method: 'POST',
    payload: { gameName: GameName, roomName: RoomName },
    headers: { 'x-user': UserName },
  })).parsed;
  process.stdout.write(`\nAwesome, awaiting for ${resp.noOfPlayers} users to join this game ...`);
  process.stdout.write(`\nYou may either invite other to join room ${RoomName}, or keep yourself bored.`);
  await request({
    url: `${APIurl}rooms/${RoomName}/users`,
    method: 'POST',
    headers: { 'x-user': UserName },
  });
  playWithSocket();
}

async function createUser(name) {
  UserName = name;
  await request({
    url: `${APIurl}users`,
    method: 'POST',
    payload: { username: UserName },
  });
  process.stdout.write(`\nGreat kick, ${UserName}, Please select a game now (an integer value) : \n`);
  Games = (await request(`${APIurl}games`)).parsed;
  Games.forEach((gm, ind) => process.stdout.write(`${ind + 1}. ${gm}\n`));
}

function catchError(err) {
  throw new Error(j2s.methods.lastValue(err, 'parsed', '_') || err);
}

function main(input) {
  const data = input.trim();
  if (data) {
    if (!UserName) {
      return createUser(data).catch(catchError);
    }
    if (!GameName) {
      GameName = Games[Number(data) - 1];
      if (!GameName) return catchError('Invalid game selected.!');
      RoomName = GameName; // let's consider for sake of experiment
      return SelectGame().catch(catchError);
    }
    Answer = Number(data);
    Socket.emit('answer', Answer);
  }
  return undefined;
}

process.stdin.resume();
process.stdin.setEncoding('utf-8');

process.stdin.on('data', main).once('end', process.exit.bind(0));
