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
    category = 'General',
    guildOnly = false,
    ownerOnly = false,
    permissions = []
  }) {
    this.bot = bot;
    this.options = {
      name, description, syntax,
      aliases, category, guildOnly,
      ownerOnly, enabled, hidden,
      permissions
    };
  }

  async execute(ctx, args, guild, user) {}
};

module.exports = MewCommand;