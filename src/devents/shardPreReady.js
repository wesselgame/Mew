/**
 * @name Mew#Events:shardPreReady
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');

const { cyan, red } = require('../deps/Colors');

class ShardPreReady extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'shardPreReady'
    });
  }

  execute(ID) {
    this.bot.print(1, `[${cyan(`Shard #${ID}`)}] >> Connecting to WS`);
  }
};

module.exports = ShardPreReady;