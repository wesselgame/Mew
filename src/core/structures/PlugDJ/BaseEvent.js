/**
 * @name Mew#BaseEvent
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

class MewEvent {
  constructor(bot, {
    event = null
  }) {
    this.bot = bot;
    this.event = event;
  }
};

module.exports = MewEvent;