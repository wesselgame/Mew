/**
 * @name Mew#Events:error
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');

const { cyan, red } = require('../deps/Colors');

class Error extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'error'
    });
  }

  execute(error, ID) {
    this.bot.print(1, `[${cyan(`Shard #${ID}`)}] !! ShardError - ${red(`${error.message}\n${error.stack}`)}`);
  }
};

module.exports = Error;