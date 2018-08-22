/**
 * @name Mew#Main
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0
 * @version 0.1.0
 * @description A discord bot ^-^
 */

console.clear();

const { DiscordClient } = require('./core');

const { print } = require('./util/Util');
const { safeLoad } = require('js-yaml');
const { join: pJoin } = require('path');
const { readFileSync } = require('fs');
const { magenta, green, cyan, yellow, red } = require('./deps/colors');

const exit = () => {
  print(1, `[${cyan('Master')}]   >> Closing connection from ${yellow(_conf.db)}`);
  print(1, `[${cyan('Master')}]   >> Closing connection from websocket`);
  try {
    mew.destory(0);
    mew.db.destory(0);
    process.exit(0);
  } catch(error) {
      process.exit(1);
  }
};

print(3, `[${magenta('Debug')}]    >> Loading "${green('emojis.yml')}, ${green('colors.yml')} and ${green('application.yml')}"`);
const _ico = safeLoad(readFileSync('assets/config/emojis.yml', 'utf8'));
const _col = safeLoad(readFileSync('assets/config/colors.yml', 'utf8'));
const _conf = safeLoad(readFileSync('application.yml', 'utf8'));
print(3, `[${magenta('Debug')}]    >> Loaded "${green('emojis.yml')}, ${green('colors.yml')} and ${green('application.yml')}"`);

print(3, `[${magenta('Debug')}]    >> Creating client`);
const mew = new DiscordClient({
  token: _conf['Discord'].token,
  clientOptions: {
    maxShards: 'auto',
    getAllUsers: false,
    autoreconnect: true
  },

  ua: _conf.ua,
  db: _conf.db,
  pkg: require('../package.json'),
  colors: _col,
  emojis: _ico,
  config: _conf
});

print(3, `[${magenta('Debug')}]    >> Client created, launching client`);
mew.launch(pJoin(__dirname, 'devents'), pJoin(__dirname, 'dcommands'));

process.on('SIGINT', exit);
process.on('uncaughtException', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}\n${error.stack}`)}`));
process.on('unhandledRejection', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}\n${error.stack}`)}`));