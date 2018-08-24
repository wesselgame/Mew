/**
 * @name Mew#Main
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0
 * @version 0.1.0
 * @description A discord bot ^-^
 */

console.clear();

const { PlugClient, DiscordClient } = require('./core');

const { print } = require('./util/Util');
const { safeLoad } = require('js-yaml');
const { join: pJoin } = require('path');
const { readFileSync } = require('fs');
const { magenta, green, cyan, yellow, red } = require('./deps/colors');

print(3, `[${magenta('Debug')}]    >> Loading "${green('emojis.yml')}, ${green('colors.yml')} and ${green('application.yml')}"`);
const _ico = safeLoad(readFileSync('assets/config/emojis.yml', 'utf8'));
const _col = safeLoad(readFileSync('assets/config/colors.yml', 'utf8'));
const _conf = safeLoad(readFileSync('application.yml', 'utf8'));
print(3, `[${magenta('Debug')}]    >> Loaded "${green('emojis.yml')}, ${green('colors.yml')} and ${green('application.yml')}"`);

const exit = () => {
  print(1, `[${cyan('Discord')}]  >> Closing connection from ${yellow(_conf.db)}`);
  print(1, `[${cyan('Discord')}]  >> Closing connection from websocket`);
  try {
    if (_conf['Discord']['enabled']) this.mewDiscord.destory(0);
    this.mewDiscord.db.destory(0);
    process.exit(0);
  } catch(error) {
      process.exit(1);
  }
};

process.on('SIGINT', exit);
process.on('uncaughtException', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}\n${error.stack}`)}`));
process.on('unhandledRejection', (error) => print(1, `[${cyan('Master')}] !! ExperimentalWarning - ${red(`${error.message}\n${error.stack}`)}`));

if (_conf['Discord']['enabled']) {
  print(3, `[${magenta('Debug')}]    >> Creating "${green('Discord')}" client`);
  this.mewDiscord = new DiscordClient({
    token: _conf['Discord']['token'],
    clientOptions: {
      maxShards: 'auto',
      getAllUsers: false,
      autoreconnect: true
    },

    ua: _conf['ua'],
    db: _conf['db'],
    pkg: require('../package.json'),
    colors: _col,
    emojis: _ico,
    config: _conf
  });

  print(3, `[${magenta('Debug')}]    >> Client created, launching client`);
  this.mewDiscord.launch(pJoin(__dirname, 'events', 'Discord'), pJoin(__dirname, 'commands', 'Discord'));

  if (_conf['PlugDJ']['enabled']) this.mewDiscord.plug = this.mewPlug;
}

if (_conf['PlugDJ']['enabled']) {
  print(3, `[${magenta('Debug')}]    >> Creating "${green('PlugDJ')}" client`);
  this.mewPlug = new PlugClient({
    mail: _conf['PlugDJ']['mail'],
    pass: _conf['PlugDJ']['pass'],
    room: _conf['PlugDJ']['room'],

    ua: _conf['ua'],
    db: _conf['db'],
    pkg: require('../package.json'),
    config: _conf
  });

  print(3, `[${magenta('Debug')}]    >> Client created, launching client`);
  this.mewPlug.launch(pJoin(__dirname, 'events', 'PlugDJ'), pJoin(__dirname, 'commands', 'PlugDJ'));

  if (_conf['Discord']['enabled']) this.mewPlug.Discord = this.mewDiscord;
}