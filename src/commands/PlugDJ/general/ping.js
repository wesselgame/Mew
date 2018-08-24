/**
 * @name Mew#GeneralCommands:ping
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */

const BaseCommand = require('../../../core/structures/PlugDJ/BaseCommand');

class Ping extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'ping',
      syntax: 'ping',
      aliases: [ 'pong' ],
      permissions: [],
      description: 'Pong!',

      enabled: true,
      hidden: false,
      category: 'General'
    });
  }

  async execute(ctx) {
    ctx.reply('Pong!');
  }
}; 

module.exports = Ping;