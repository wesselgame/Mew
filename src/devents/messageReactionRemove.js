/**
 * @name Mew#Events:messageReactionRemove
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');
const { green, cyan } = require('../deps/Colors');

class MessageReactionRemove extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'messageReactionRemove'
    });
  }

  async execute(message, emoji) {
    message.channel.getMessage(message.id).then(async(mes) => {
      const guild = await this.bot.m.connection.collection('srv').findOne({ serverId: mes.channel.guild.id });
      if (!guild || !guild['starboard'] || !guild['starboard'].enabled) return;
      if (emoji.name !== guild['starboard'].emoji.split(':')[0]) return;
      if (/<mew:disableStars>/g.test(mes.channel.topic ? mes.channel.topic.toLowerCase() : '')) return;

      const board =
        mes.channel.guild.channels.get(guild['starboard'].board ? guild['starboard'].board : 0) ?
        mes.channel.guild.channels.get(guild['starboard'].board) : undefined;
      if (!board) {
        mes.addReaction(this.bot.emoji['STARBOARD']['0']).catch(() => { return; });
        return setTimeout(() => mes.channel.removeMessageReaction(mes.id, this.bot.emoji['STARBOARD']['0'], this.bot.user.id).catch(() => { return; }), 5000);
      }
      if (mes.channel.id === board.id) {
        mes.addReaction(this.bot.emoji['STARBOARD']['1']).catch(() => { return; });
        return setTimeout(() => mes.channel.removeMessageReaction(mes.id, this.bot.emoji['STARBOARD']['1'], this.bot.user.id).catch(() => { return; }), 5000);
      }

      const star = await this.bot.m.connection.collection('stars').findOne({ messageId: mes.id });
      if (guild['starboard'].emoji in mes.reactions && mes.reactions[guild['starboard'].emoji].count === guild['starboard'].minimum ||
        guild['starboard'].emoji in mes.reactions && mes.reactions[guild['starboard'].emoji].count > guild['starboard'].minimum) {
          let structure = {
            color: this.bot.col['STARBOARD'],
            author: {
              name: `${mes.author.username}#${mes.author.discriminator}`,
              icon_url: mes.author.avatarURL || mes.author.defaultAvatarURL
            },
            timestamp: new Date(mes.timestamp)
          };
          if(mes.embeds.length > 0 && 'url' in mes.embeds[0]) structure.url = mes.embeds[0].url;        
          if(mes.embeds.length > 0 && 'type' in mes.embeds[0]) structure.type = mes.embeds[0].type;
          if(mes.embeds.length > 0 && 'title' in mes.embeds[0]) structure.title = mes.embeds[0].title;
          if(mes.embeds.length > 0 && 'image' in mes.embeds[0]) structure.image = mes.embeds[0].image;
          if(mes.embeds.length > 0 && 'video' in mes.embeds[0]) structure.video = mes.embeds[0].video;
          if(mes.embeds.length > 0 && 'fields' in mes.embeds[0]) structure.fields = mes.embeds[0].fields;
          if(mes.embeds.length > 0 && 'provider' in mes.embeds[0]) structure.provider = mes.embeds[0].provider;
          if(mes.embeds.length > 0 && 'thumbnail' in mes.embeds[0]) structure.thumbnail = mes.embeds[0].thumbnail;
          if(mes.embeds.length > 0 && 'description' in mes.embeds[0]) structure.description = mes.embeds[0].description;
          else if(mes.content !== '') structure.description = mes.content;
          if(!('image' in structure) && mes.attachments.length > 0) {
            structure.image = {
              url: mes.attachments[0].url,
              proxy_url: mes.attachments[0].proxy_url,
              width: mes.attachments[0].width,
              height: mes.attachments[0].height
            };
          }
          const emote = guild['starboard'].emoji.split(':')[1] ? `<:${guild['starboard'].emoji}>` : guild['starboard'].emoji;
          const reactions = mes.reactions[guild['starboard'].emoji] ? mes.reactions[guild['starboard'].emoji].count : 0;
          if (star) {
            board.getMessage(star.boardChannelId).then(async(boardMsg) => {
              this.bot.m.connection.collection('stars').updateOne(
                { messageId: mes.id },
                { $set: { stars: reactions } }, (err, e) => { if (err) throw err; });
              if (!boardMsg) {
                return board.createMessage({
                  content: `${emote} ${reactions} ${mes.channel.mention} (${mes.id})`,
                  embed: structure
                }).catch(() => {
                  mes.addReaction(this.bot.emoji['STARBOARD']['0']).catch(() => { return; });
                  return setTimeout(() => mes.channel.removeMessageReaction(mes.id, this.bot.emoji['STARBOARD']['0'], this.bot.user.id).catch(() => { return; }), 5000);
                });
              } else {
                board.editMessage(boardMsg.id, {
                  content: `${emote} ${reactions} ${mes.channel.mention} (${mes.id})`,
                  embed: structure
                }).catch(() => {
                  mes.addReaction(this.bot.emoji['STARBOARD']['0']).catch(() => { return; });
                  return setTimeout(() => mes.channel.removeMessageReaction(mes.id, this.bot.emoji['STARBOARD']['0'], this.bot.user.id).catch(() => { return; }), 5000);
                });
              }
            });
          }
        } else {
          if (star) {
            board.getMessage(star.boardChannelId).then(async(boardMsg) => {
              if (!boardMsg) return;
              boardMsg.delete();
              this.bot.m.connection.collection('stars').deleteOne({ messageId: mes.id });
            }).catch(() => { return; });
          }
        }
    });
  }
};

module.exports = MessageReactionRemove;