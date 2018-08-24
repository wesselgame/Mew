/**
 * @name Mew#Events:advance
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const BaseEvent = require('../../core/structures/PlugDJ/BaseEvent');

const { green, blue } = require('../../deps/colors');

class WaitlistUpdate extends BaseEvent {
  constructor(bot) {
    super(bot, {
      event: 'waitlistUpdate'
    });

    this.autoplay = false;
  }

  async execute(next) {
    const me = await this.bot.me();
    const DJ = await this.bot.dj();

    if (next.length < 1 && !DJ) {
      if (this.bot.conf['PlugDJ']['autoplay']['enabled'] && !this.autoplay) {
        this.autoplay = true;
        setTimeout(async() => {
          const playlists = await this.bot.getPlaylists();
          
          let playlist = this.bot.conf['PlugDJ']['autoplay']['playlists'][Math.floor(Math.random() * Math.floor(this.bot.conf['PlugDJ']['autoplay']['playlists'].length))];
          playlist = playlists.filter((i) => i.name === playlist)[0];
          
          if (!playlist) return;
          this.bot.shufflePlaylist(playlist.id);
          this.bot.activatePlaylist(playlist.id);
          this.bot.joinWaitlist();
          if (!DJ) {
            this.bot.print(2, `[${blue('PlugDJ')}]   >> Waitlist empty, autoplaying "${green(playlist.name)}"...`);
            this.bot.chat(`Starting autoplay on "${playlist.name}"...`);
          }
        }, 3000);
      }
    } else if (next.length > 0 && this.bot.waitlist().contains(me.id) || next.length > 0 && DJ && DJ.id === me.id) {
      const entry = await this.bot.historyEntry();

      if (DJ.id === me.id) entry.skip();
      this.autoplay = false;
      this.bot.leaveWaitlist();
      this.bot.chat(`New user on the waitlist, stopping autoplay...`);
      this.bot.print(2, `[${blue('PlugDJ')}]   >> New waitlist entry, stopping autoplay...`);
    }
  }
};

module.exports = WaitlistUpdate;