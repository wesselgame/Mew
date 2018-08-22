/**
 * @name Mew#DB:schemas
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const mongoose = require('mongoose');
const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');

const Schema = mongoose.Schema;

const _conf = safeLoad(readFileSync('application.yml', 'utf8'));

const guild = new Schema({
  serverId: { type: String, default: undefined },
  prefix: { type: String, default: _conf['Discord'].prefix },
  reddit: {
    enabled: { type: Boolean, default: false },
    channel: { type: String, default: undefined },
    reaction: { type: String, default: undefined },
    subreddit: { type: String, default: undefined }
  },
  starboard: {
    emoji: { type: String, default: '⭐' },
    board: { type: String, default: undefined },
    enabled: { type: Boolean, default: false },
    minimum: { type: Number, default: 1 }
  },
  verification: {
    channelId: { type: String, default: undefined },
    message: { type: Boolean, default: false },
    content: { type: String, default: undefined },
    enabled: { type: Boolean, default: false },
    role: { type: String, default: undefined }
  },
  blacklist: []
});

const star = new Schema({
  stars: { type: Number, default: 1 },
  serverId: { type: String, default: undefined },
  channelId: { type: String, default: undefined },
  messageId: { type: String, default: undefined },
  embedObject: {},
  boardChannelId: { type: String, default: undefined }
});

const verifications = new Schema({
  code: { type: String, default: undefined },
  guildId: { type: String, default: undefined },
  authorId: { type: String, default: undefined }
});

exports.srv = mongoose.model('srv', guild, 'srv');
exports.stars = mongoose.model('stars', star, 'stars');
exports.verifications = mongoose.model('verifications', verifications, 'verifications')