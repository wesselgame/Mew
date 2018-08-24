/**
 * @name mew#Events:unknown
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/Discord/BaseEvent');

const { cyan, green, yellow } = require('../../deps/colors');

class Unknown extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'unknown'
    });
  }

  execute(packet, ID) {
    this.bot.print(3, `${ID !== undefined ? `[${cyan(`Shard #${ID}`)}] >>` : `[${cyan(`Master`)}]   >>`} '${green('UNKNOWN')}' packet received - ${yellow(packet)}`);
  }
};

module.exports = Unknown;