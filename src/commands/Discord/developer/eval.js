/**
 * @name Mew#DevCommands:eval
 * @author: Wessel Tip <wessel@go2it.eu>
 * @license: GPL-3.0
 */

const BaseCommand = require('../../../core/structures/Discord/BaseCommand');

const util = require('util');

class Eval extends BaseCommand {
  constructor(bot) {
    super(bot, {
      name: 'eval',
      syntax: 'eval <code:string>',
      aliases: [ 'evaluate' ],
      permissions: [ 'embedLinks' ],
      description: 'Evaluate a snippet of code',

      enabled: true,
      hidden: true,
      cooldown: 1,
      category: 'General',
      ownerOnly: true,
      guildOnly: false
    });
  }

  async execute(ctx, args, guild) {
    let input = args[0] ? args.join(' ') : 'this';
    let result = 'n/a';
    let silent = input.includes('-slient') || input.includes('-s');
    let asynchr = input.includes('return') || input.includes('await');

    if (silent) input = input.replace(/--silent|-s/i, '');
    
    try {
      result = await (asynchr ? eval(`(async()=>{${input}})();`) : eval(input));

      if (typeof result !== 'string') {
        result = this.bot.util.shorten(this.bot.util.redact(util.inspect(result)), 1950);
      } else {
        result = this.bot.util.shorten(this.bot.util.redact(result), 1950);
      }
    } catch (err) {
      result = this.bot.util.shorten(this.bot.util.redact(err.message), 1950);
    } finally {
      if (silent) return;
      
      ctx.sendEmbed({
        color: this.bot.col['DEVELOPER_EVAL'],
        description: `${this.bot.ico['DEVELOPER_EVAL']} **Result**:\n\`\`\`${result.length < 1 ? 'n/a' : `js\n${result}`}\`\`\``
      });
    }
  }
}; 

module.exports = Eval;