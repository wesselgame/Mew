/**
 * @name Mew#BaseCommand
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

class MewCommand {
  constructor(bot, {
    name = null,
    syntax = 'n/a',
    aliases = [],
    description = 'n/a',

    enabled = true,
    hidden = false,
    cooldown = 1,
    category = 'General',
    guildOnly = false,
    ownerOnly = false,
    permissions = []
  }) {
    this.bot = bot;
    this.options = {
      name, description, syntax,
      aliases, category, guildOnly,
      ownerOnly, enabled, cooldown,
      hidden, permissions
    };
  }

  async execute(ctx, args, guild) {}
};

module.exports = MewCommand;