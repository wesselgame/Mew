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

  get guild() { return this.channel.guild; }

  async send(content) { await this.channel.createMessage(content); }
  reply(content) { return this.send(`<@${this.author.id}>, ${content}`); }
  sendCode(lang, content) { return this.send(`\`\`\`${lang || null}\n${content}\`\`\``); }
  sendEmbed(content) {
    if (content instanceof Object) {
      return this.send({
        embed: content
      });
    }else {
      return 'Invalid embed object';
    }
  }

  setMember(member) { this.member = this.guild && this.author && this.guild.members.get(this.author.id) || null; }
  setPrefix(prefix) { this.prefix = prefix; }

  getPrefix() { return this.prefix; }
  getMember() { return this.member; }
};

module.exports = CommandContext;