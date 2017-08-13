import fs from 'fs'
import promisify from 'util.promisify'
import j2s from 'json2server'
import pkg from '../package.json'
import serverJson from './server.json'
import configJson from './j2s.json'

const replace = j2s.methods.replace;
const writeFile = promisify(fs.writeFile);

async function main() {
  replace(serverJson, { pkg });
  replace(configJson, { mainVersion: pkg.version.split('.').shift() });
  await Promise.all([
    writeFile('./server.json', JSON.stringify(serverJson, undefined, 2)),
    writeFile('./j2s.json', JSON.stringify(configJson, undefined, 2)),
  ]);
}

main();
