/**
 * @name Mew#Util
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const moment = require('moment');
const { strip } = require('../deps/colors');
const { safeLoad } = require('js-yaml');
const { mkdir, readFileSync, appendFileSync } = require('fs');

const _conf = safeLoad(readFileSync('./application.yml', 'utf8'));
const credentials = new RegExp([_conf['Discord'].token].join('|'), 'gi');

class Util {
  /**
   * @name Util#print
   * @param {number} lvl - The level of debugging
   * @param {string} msg - The message to log
   * @example print(1, 'print!');
   * @returns null
   * @description Custom debugging levels
   */
  static print(lvl = 0, msg = '') {
    let cb;
    try {
      mkdir('tmp/log', 777, (err) => {
        if (err) {
          if (err.code !== 'EEXIST') throw err;
        };
      });
    } catch (err) {
      throw err;
    } finally {
      if (lvl < 1) {
        console.log(`[${moment(new Date).format('HH[:]mm[:]ss')}] ${msg}`);
        appendFileSync(`tmp/log/${moment(new Date).format('DD[-]MM[-]YYYY')}.log`, `[${moment(new Date).format('HH[:]mm[:]ss')}] ${strip(msg)}\n`);
      } else if (lvl === 1 && _conf.debug > 0) {
        console.log(`[${moment(new Date).format('HH[:]mm[:]ss')}] ${msg}`);
        appendFileSync(`tmp/log/${moment(new Date).format('DD[-]MM[-]YYYY')}.log`, `[${moment(new Date).format('HH[:]mm[:]ss')}] ${strip(msg)}\n`);
      } else if (lvl === 2 && _conf.debug > 1) {
        console.log(`[${moment(new Date).format('HH[:]mm[:]ss')}] ${msg}`);
        appendFileSync(`tmp/log/${moment(new Date).format('DD[-]MM[-]YYYY')}.log`, `[${moment(new Date).format('HH[:]mm[:]ss')}] ${strip(msg)}\n`);
      } else if (lvl === 3 && _conf.debug > 2) {
        console.log(`[${moment(new Date).format('HH[:]mm[:]ss')}] ${msg}`);
        appendFileSync(`tmp/log/${moment(new Date).format('DD[-]MM[-]YYYY')}.log`, `[${moment(new Date).format('HH[:]mm[:]ss')}] ${strip(msg)}\n`);
      } else return;
    }
  }

  /**
   * @name Util#shorten
   * @param {string} text - The string to shorten
   * @param {number} maxLen - The maximum length of the string
   * @example shorten('hello there!', 5);
   * @returns {string} - Shortened string
   * @description Shortens a string
   */ 
  static shorten(text, maxLen = 2000) { return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text; }
  
  /**
   * @name Util#redact
   * @param {string} text - The string to redact
   * @example redact('hello <TOKEN>');
   * @returns {string} - Redacted string
   * @description Removes private information
   */
  static redact(str) { return str.replace(credentials, '<REDACTED>'); }

  /**
   * @name Util#getPercentage
   * @param {Integer} oldNum - The old number
   * @param {Integer} newNum - The new number
   * @example getPercentage(100, 50);
   * @returns {Integer} - Returned percentage
   * @description Turn 2 numbers into a percentage
   */
  static getPercentage(oldNum, newNum) { return ((oldNum - newNum) / oldNum) * 100; }
  
  /**
   * @name Util#escapeMarkdown
   * @param {string} text - The string to escape
   * @param {boolean} onlyCodeBlock - Only repalce codeblocks or not
   * @param {boolean} onlyInlineCode - Only repalce inline code or not
   * @example escapeMarkdown('**Hello there!**');
   * @returns {string} - escaped string
   * @description Strips a message from all markdown
   */
  static escapeMarkdown(text, onlyCodeBlock = false, onlyInlineCode = false) {
    if (onlyCodeBlock) return text.replace(/```/g, '`\u200b``');
    if (onlyInlineCode) return text.replace(/\\(`|\\)/g, '$1').replace(/(`|\\)/g, '\\$1');
    return text.replace(/\\(\*|_|`|~|\\)/g, '$1').replace(/(\*|_|`|~|\\)/g, '\\$1');
  }

  /**
   * @name Util#resolveUser
   * @param {string} query - The user to search for
   * @param {object} bot - The bot object to search in
   * @example resolveUser('Clyde', this.bot);
   * @returns {object} - The found user
   * @description Search for a user
   */
  static resolveUser(query, bot) {
    return new Promise((resolve, reject) => {
      if (/^\d+$/.test(query)) {
        const user = bot.users.get(query);
        if (user) return resolve(user);
      } else if (/^<@!?(\d+)>$/.test(query)) {
        const match = query.match(/^<@!?(\d+)>$/);
        const user = bot.users.get(match[1]);
        if (user) return resolve(user);
      } else if (/^(.+)#(\d{4})$/.test(query)) {
        const match = query.match(/^(.+)#(\d{4})$/);
        const users = bot.users.filter((user) => user.username === match[1] && Number(user.discriminator) === Number(match[2]));
        if (users.length > 0) return resolve(users[0]);
      } else {
        const users = bot.users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()));
        if (users.length > 0) return resolve(users[0]);
      }

      reject();
    });
  }
};

module.exports = Util;