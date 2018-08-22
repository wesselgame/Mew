/**
 * @name Mew#GeneralCommands:ping
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */

const BaseCommand = require('../../core/structures/Discord/BaseCommand');

class Ping extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      syntax: 'ping',
      aliases: [ 'pong' ],
      permissions: [ 'embedLinks' ],
      description: 'Get my current latency to discord',

      enabled: true,
      hidden: false,
      cooldown: 1,
      category: 'General',
      guildOnly: false
    });
  }

  async execute(ctx) {
    const date = Date.now();
    const latency = ctx.channel.guild ? ctx.channel.guild.shard.latency : 0;
    
    const health =
      latency < 200 ? `Good (**${this.bot.util.getPercentage(200, latency).toFixed()}%** \`[${'='.repeat(10 - Math.round(10* latency / 200))}${'-'.repeat(Math.round(10* latency / 200))}]\`)` :
      latency > 200 && latency < 400 ? `Okay (**${this.bot.util.getPercentage(400, latency).toFixed()}%** \`[${'='.repeat(10 - Math.round(10* latency / 400))}${'-'.repeat(Math.round(10* latency / 400))}]\`)` :
      'Bad (**0%** `[----------]`)';
    const message = await ctx.channel.createMessage({
      embed: {
        color: this.bot.col['GENERAL_PING']['0'],
        description: `${this.bot.ico['GENERAL_PING']['0']} pinging...`
      }
    });

    message.edit({
      embed: {
        color: latency < 200 ? this.bot.col['GENERAL_PING']['1'] : latency > 200 && latency < 400 ? this.bot.col['GENERAL_PING']['2'] : this.bot.col['GENERAL_PING']['3'],
        description: [
          `${this.bot.ico['GENERAL_PING']['1']} **Heartbeat**: \`${latency.toFixed(2)}\`ms`,
          `${this.bot.ico['GENERAL_PING']['2']} **Round-trip**: \`${(Date.now() - date).toFixed(2)}\`ms`,
          `${this.bot.ico['GENERAL_PING']['3']} **Health**: ${health}`
        ].join('\n')
      }
    });
  }
}; 

module.exports = Ping;