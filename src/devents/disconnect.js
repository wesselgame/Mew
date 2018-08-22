/**
 * @name Mew#Events:disconnect
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');

const { cyan, red } = require('../deps/Colors');

class Disconnect extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'disconnect'
    });
  }

  execute() {
    this.bot.print(1, `[${cyan(`Master`)}]   >> ${red('All websockets disconnected')}`);
  }
};

module.exports = Disconnect;