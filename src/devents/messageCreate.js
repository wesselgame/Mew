/**
 * @name Mew#Events:messageCreate
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');

class MessageCreate extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'messageCreate'
    });
  }

  execute(msg) {
    this.bot.commandStore.handleCommand(msg);
  }
};

module.exports = MessageCreate;