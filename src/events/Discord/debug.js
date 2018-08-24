/**
 * @name Mew#Events:debug
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/Discord/BaseEvent');

const { cyan, green, yellow } = require('../../deps/colors');

class Debug extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'debug'
    });
  }

  execute(message, ID) {
    this.bot.print(4, `${ID !== undefined ? `[${cyan(`Shard #${ID}`)}] >>` : `[${cyan(`Master`)}]   >>`} '${green('DEBUG')}' packet received - ${yellow(message)}`);
  }
};

module.exports = Debug;