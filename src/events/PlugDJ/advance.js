/**
 * @name Mew#Events:advance
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/PlugDJ/BaseEvent');

class Advance extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'advance'
    });

    this.strikes = new Set();
  }

  async execute(next, previous) {
    if (next) this.bot.woot();
  }
};

module.exports = Advance;