/**
 * @name Mew#Events:ready
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/Discord/BaseEvent');

const { create } = require('../../util/Token');
const { green, cyan } = require('../../deps/colors');

const master = create('abcdefghijklmnopqrstuvwxzyABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');

class GuildMemberAdd extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'guildMemberAdd'
    });
  }

  async execute(guild, member) {
    const entry = await this.bot.m.connection.collection('srv').findOne({ serverId: guild.id });
    if (!entry) return;

    if (entry['verification'] && entry['verification'].enabled) {
      const dm = await member.user.getDMChannel();
      const user = await this.bot.m.connection.collection('verifications').findOne({
        guildId: guild.id,
        authorId: member.user.id
      });
      member.addRole(entry['verification'].role).catch(() => { return; });

      if (!user) {
        const slave = `M${master(Math.floor(Math.random() * Math.floor(4) +4))}-${master(Math.floor(Math.random() * Math.floor(5) +4))}`;
        const query = new this.bot.m['schemas']['verifications']({
          code: slave,
          guildId: guild.id,
          authorId: member.user.id
        });
        query.save();
        dm.createMessage((entry['verification'].content ? entry['verification'].content.join('\n') : undefined) + `\n\nType \`${entry.prefix}verify ${slave}\` to verify that you're not a bot`);
      } else {
        dm.createMessage((entry['verification'].content ? entry['verification'].content.join('\n') : undefined) + `\n\nType \`${entry.prefix}verify ${user.code}\` to verify that you're not a bot`);
      }
    }
  }
};

module.exports = GuildMemberAdd;