/**
 * @name Mew#Events:hello
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/PlugDJ/BaseEvent');

const { cyan, green, yellow } = require('../../deps/colors');

class Chat extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'chat'
    });
  }

  execute(msg) {
    this.bot.commandStore.handleCommand(msg);
  }
};

module.exports = Chat;