/**
 * @name Mew#CommandContext
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

class CommandContext {
  constructor(bot, msg) {
    Object.assign(this, msg);
    this.msg = msg;
    this.bot = bot;
    this.prefix = null;
  }

  async send(content) { await this.bot.chat(content); }
  reply(content) { return this.send(`[${this.user}] ${content}`); }

  setPrefix(prefix) { this.prefix = prefix; }

  getPrefix() { return this.prefix; }
};

module.exports = CommandContext;