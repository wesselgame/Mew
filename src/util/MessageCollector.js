/**
 * @name Mew#MessageCollector
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

class MessageCollector {
  constructor(bot) {
    this.collectors = {};
    bot.on('messageCreate', this.verify.bind(this));
  }

  async verify(msg) {
    const collector = this.collectors[msg.channel.id + msg.author.id];
    if (collector && collector.filter(msg)) {
      collector.res(msg);
    }
  }

  awaitMessage(channelId, userId, timeout = 30000, filter = () => true) {
    return new Promise((res) => {
      if (this.collectors[channelId + userId]) delete this.collectors[channelId + userId];

      this.collectors[channelId + userId] = {
        res, filter
      };

      setTimeout(res.bind(null, false), timeout);
    });
  }
};

module.exports = MessageCollector;