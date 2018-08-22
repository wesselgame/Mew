/**
 * @name Mew#Events:shardReady
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const { cyan } = require('../deps/Colors');

const BaseEvent = require('../core/structures/Discord/BaseEvent');

class ShardReady extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'shardReady'
    });
  }

  execute(ID) {
    this.bot.print(1, `[${cyan(`Shard #${ID}`)}] >> Connected to WS`);
  }
};

module.exports = ShardReady;