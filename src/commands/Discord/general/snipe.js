/**
 * @name Mew#GeneralCommands:snipe
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */

const BaseCommand = require('../../../core/structures/Discord/BaseCommand');

let structure = {};

class Snipe extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'snipe',
      syntax: 'snipe',
      aliases: [ 's' ],
      permissions: [ 'embedLinks' ],
      description: 'Re-post the latest deleted message',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'General',
      guildOnly: true
    });
  }

  async execute(ctx) {
    const message = this.bot.cache.get(`${ctx.channel.id}-SNIPES`);
    if (!message) return ctx.send(`${this.bot.ico['GENERAL_SNIPE']['0']} ${ctx.author.mention}, I couldn't snipe any messages`);

    structure = {
      author: {
        name: `${message.author.username}#${message.author.discriminator} (${message.author.id})`,
        icon_url: message.author.avatar ? message.author.avatarURL : message.author.defaultAvatarURL
      },
      color: this.bot.col['GENERAL_SNIPE'],
      footer: {
        text: `Sniped by ${ctx.author.username}#${ctx.author.discriminator}`,
        icon_url: ctx.author.avatar ? ctx.author.avatarURL: ctx.author.defaultAvatarURL
      },
      timestamp: new Date(message.timestamp).toISOString()
    };

    if(ctx.embeds.length > 0 && 'url' in ctx.embeds[0]) structure.url = ctx.embeds[0].url;        
    if(ctx.embeds.length > 0 && 'type' in ctx.embeds[0]) structure.type = ctx.embeds[0].type;
    if(ctx.embeds.length > 0 && 'title' in ctx.embeds[0]) structure.title = ctx.embeds[0].title;
    if(ctx.embeds.length > 0 && 'image' in ctx.embeds[0]) structure.image = ctx.embeds[0].image;
    if(ctx.embeds.length > 0 && 'video' in ctx.embeds[0]) structure.video = ctx.embeds[0].video;
    if(ctx.embeds.length > 0 && 'fields' in ctx.embeds[0]) structure.fields = ctx.embeds[0].fields;
    if(ctx.embeds.length > 0 && 'provider' in ctx.embeds[0]) structure.provider = ctx.embeds[0].provider;
    if(ctx.embeds.length > 0 && 'thumbnail' in ctx.embeds[0]) structure.thumbnail = ctx.embeds[0].thumbnail;
    if(ctx.embeds.length > 0 && 'description' in ctx.embeds[0]) structure.description = ctx.embeds[0].description;
    else if(ctx.content !== '') structure.description = ctx.content;
    if(!('image' in structure) && ctx.attachments.length > 0) {
      structure.image = {
        url: ctx.attachments[0].url,
        proxy_url: ctx.attachments[0].proxy_url,
        width: ctx.attachments[0].width,
        height: ctx.attachments[0].height
      };
    }

    ctx.sendEmbed(structure);
    this.bot.cache.delete(`${ctx.channel.id}-SNIPES`);
  }
}; 

module.exports = Snipe;
