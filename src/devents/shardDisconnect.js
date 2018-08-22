/**
 * @name Mew#Events:shardDisconnect
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');

const { cyan, red } = require('../deps/Colors');

class ShardDisconnect extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'shardDisconnect'
    });
  }

  execute(error, ID) {
    this.bot.print(1, `[${cyan(`Shard #${ID}`)}] >> Disconnected from WS (${red(error && error.code ? error.code : 'FORCED')})`);
  }
};


module.exports = ShardDisconnect;