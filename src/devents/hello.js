/**
 * @name Mew#Events:hello
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../core/structures/Discord/BaseEvent');

const { cyan, green, yellow } = require('../deps/Colors');

class Hello extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'hello'
    });
  }

  execute(trace, ID) {
    this.bot.print(3, `[${cyan(`Shard #${ID}`)}] >> '${green('HELLO')}' packet received - ${yellow(trace)}`);
  }
};

module.exports = Hello;