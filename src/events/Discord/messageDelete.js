/**
 * @name Mew#Events:messageDelete
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/Discord/BaseEvent');

const { cyan, red } = require('../../deps/colors');

class MessageDelete extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'messageDelete'
    });
  }

  execute(msg) {
    if (!msg.channel.guild || !msg.author) return;
      
    this.bot.cache.set(`${msg.channel.id}-SNIPES`, {
      id: msg.channel.id,
      content: msg.embeds.length > 0 ? msg.embeds[0] : msg.content,
      author: msg.author,
      timestamp: msg.timestamp
    });
  }
};

module.exports = MessageDelete;