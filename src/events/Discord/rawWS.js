/**
 * @name Mew#Events:rawWS
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/Discord/BaseEvent');

const { cyan, green, yellow } = require('../../deps/colors');

class RawWS extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'rawWS'
    });
  }

  execute(packet, ID) {
    this.bot.print(4, `${ID !== undefined ? `[${cyan(`Shard #${ID}`)}] >>` : `[${cyan(`Master`)}]   >>`} '${green('RAWWS')}' packet received - ${yellow(packet)}`);
  }
};

module.exports = RawWS;