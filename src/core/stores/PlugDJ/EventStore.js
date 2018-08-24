/**
 * @name Mew#EventStore
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const { readdirSync } = require('fs');
const { green, red, blue } = require('../../../deps/colors');

class EventStore {
  /**
   * @name mew#EventStore
   * @param {Object} bot - The bot object
   * @returns {Object} bot - The bot object
   * @description Initialize all events.
   */
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * @name mew#EventStore:exec
   * @param {Object} event - The event toe xecute
   * @returns {Object} callback - The callback of the event
   * @description Execute an event.
   */
  doEvent(event) {
    const doAsync = async(...args) => {
      try {
        await event.execute(...args);
      } catch(err) {
        this.bot.print(1, `[${blue('PlugDJ')}]   !! EventError - ${red(`${err.message}\n${err.stack}`)}`);
      }
    };

    this.bot.on(event.event, doAsync);
  }

  /**
   * @name mew#EventStore:run
   * @param {String} dir - The directory of all events
   * @returns {Object} callback - The callback of the store
   * @description Load all events
   */
  async run(dir) {
    const files = await readdirSync(dir);
    this.bot.print(1, `[${blue('PlugDJ')}]   >> Loading ${green(files.length)} events`);
    files.forEach((f) => {
      const evt = new(require(`${dir}/${f}`))(this.bot);
      
      if (!this.bot.conf['PlugDJ']['Events'][evt.event.toLowerCase()]) return;
      this.bot.print(2, `[${blue('PlugDJ')}]   >> Loaded event "${green(evt.event)}"`);

      this.doEvent(evt);
    });
    return { success: true };
  }

  toJSON() { return { bot: this.bot }; }
};

module.exports = EventStore;