/**
 * @name mew#RedditManager
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const fetch = require('node-fetch');
const { isUri } = require('../../../deps/valid-url');
const { decodeHTML } = require('../../../deps/entities');

const dates = {};
const intervals = {};

class RedditManager {
  /**
   * @name mew#redditmanager
   * @param {Object} bot - The main bot
   * @param {String} url - The url of the subreddit
   * @param {Object} guild - The db entry of the guild
   * @returns {Boolean} creation - created if not
   * @description Start reddit feeds
   */
  constructor(bot, url, guild) {

    this.url = url ? url : undefined;
    this.bot = bot ? bot : undefined;
    this.guild = guild ? guild : undefined;
    
    this.fetchOptions = {
      method: 'GET',
      headers: {
        'User-Agent': this.bot.ua,
        'content-type': 'application/json'
      }
    };
  }

  /**
   * @name mew#redditmanager:validate
   * @param {String} url - The url to validate
   * @returns {Boolean} reddit - The subreddit that was found
   * @description Check if a subreddit exists
   */
  async validate(url) {
    const req = await fetch(`${url}/about.json`, {
      method: 'GET',
      headers: {
        'User-Agent': this.bot.ua,
        'content-type': 'application/json'
      }
    });
    const res = await req.json();
    if (res.error === 404 || res.data.over18) return false;
    else return true;
  }

  /**
   * @name mew#redditmanager:startfeed
   * @param {String} channelId - The channel to send it in
   * @returns {Null} null - Nothing.
   * @description Start a reddit feed
   */
  async startfeed(channelId, ratelimit, emoji) {
    const reddit = await this.validate(this.url);

    if (reddit) {
      intervals[channelId] = setInterval(async() => {
        const req = await fetch(`${this.url}/new.json?limit=1`, this.fetchOptions);
        const res = await req.json();

        for (let i = 0; i < res.data.children.reverse().length; i++) {
          const post = res.data.children.reverse()[i].data;

          if (!dates[channelId] || post.created_utc > dates[channelId].last) {
            dates[channelId] = { last: post.created_utc };
            if (post.over_18) return;
            const message = await this.bot.createMessage(channelId, {
              embed: {
                url: `https://redd.it/${post.id}`,
                title: `${post.link_fair_text ? `[${post.link_flair_text}] ` : ''}${decodeHTML(post.title)}`,
                color: this.bot.col['REDDIT_FEED'],
                image: { url: isUri(post.thumbnail) ? decodeHTML(post.thumbnail) : null },
                description: `${post.is_self ? decodeHTML(post.selftext.length > 253 ? post.selftext.slice(0, 253).concat('...') : post.selftext) : ''}`,
                
                footer: {
                  text: `${post.is_self ? 'self post' : 'link post'} by ${post.author} | ${this.bot.user ? this.bot.user.username : '\_\_\_'} reddit feed`,
                  icon_url: `https://www.redditstatic.com/desktop2x/img/favicon/ms-icon-144x144.png`
                },
                timestamp: new Date(post.created_utc * 1000)
              }
            }).catch((err) => { return this.endfeed(channelId); });
            if (emoji && message) await message.addReaction(emoji).catch(() => { return; });
          }
          dates[channelId] ? ++dates[channelId].last : undefined;
        }
      }, ratelimit);
    }
  }

  /**
   * @name mew#redditmanager:endfeed
   * @param {String} channelId - The channel to end the feed from
   * @returns {Null} null - Nothing.
   * @description Stop a reddit feed
   */
  endfeed(channelId) {
    if (intervals[channelId]) {
      clearInterval(intervals[channelId]);
      delete intervals[channelId];
    } else return false;
  }
};

module.exports = RedditManager;
