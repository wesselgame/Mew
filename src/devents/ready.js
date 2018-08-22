/**
 * @name Mew#Events:ready
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');

const { green, cyan } = require('../deps/Colors');

class Ready extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'ready'
    });
  }

  execute() {
    this.bot.print(1, `[${cyan('Master')}]   >> ${green('All websockets connected')}`);
    for (const shard of this.bot.shards.map(s => s)) {
      if (this.bot.conf['Discord']['playing'].enabled) {
          this.bot.editStatus('online', {
              name: this.bot.conf['Discord']['playing'].name
                 .replace(/\$\(shard:Id\)/g, shard.id)
                 .replace(/\$\(bot:prefix\)/g, this.bot.conf['Discord'].prefix),
              type: this.bot.conf['Discord']['playing'].type,
              url: this.bot.conf['Discord']['playing'].url
          });
      }
    }
  }
};

module.exports = Ready;