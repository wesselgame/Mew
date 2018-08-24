/**
 * @name Mew#ModerationCommands:verify
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */

const BaseCommand = require('../../../core/structures/Discord/BaseCommand');

const moment = require('moment');

class Verify extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'verify',
      syntax: 'verify <code:string>',
      aliases: [],
      permissions: [],
      description: 'Verify that you\'re not a bot',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'Moderation',
      guildOnly: true
    });
  }

  async execute(ctx, args, guild) {
    if (!guild['verification'] || !guild['verification'].enabled) return ctx.send(`${this.bot.ico['MODERATION_VERIFY']['0']} ${ctx.author.mention}, Verification isn't enabled`);
    if (ctx.channel.id !== guild['verification'].channelId) return ctx.send(`${this.bot.ico['MODERATION_VERIFY']['1']} ${ctx.author.mention}, This command can only be used in the verification channel.`);
    
    const entry = await this.bot.m.connection.collection('verifications').findOne({ 
      code: args[0] ? args.join(' ') : undefined,
      guildId: ctx.guild.id,
      authorId: ctx.author.id
    });
    if (!entry) return ctx.msg.delete();
    
    ctx.msg.delete();
    ctx.member.removeRole(guild['verification'].role);
    this.bot.m.connection.collection('verifications').deleteOne({
      code: args[0] ? args.join(' ') : undefined,
      guildId: ctx.guild.id,
      authorId: ctx.author.id
    });
    if (guild['verification'].message) {
      this.bot.createMessage(guild['verification'].channelId, `\`[${moment(new Date).format('HH:mm:ss')}]\` ${this.bot.ico['MODERATION_VERIFY']['1']} ${ctx.author.username}#${ctx.author.discriminator} (\`${ctx.author.id}\`) has been verified`);
    } else return;
  }
}; 

module.exports = Verify;