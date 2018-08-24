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
  roomName: { type: String, default: _conf['PlugDJ'].room },
  prefix: { type: String, default: _conf['PlugDJ'].prefix },
  blacklist: []
});

const user = new Schema({
  userId: { type: String, default: null },
  points: { type: Number, default: 0 },
  infractions: []
});

exports.srv = mongoose.model('rooms', guild, 'rooms');
exports.usr = mongoose.model('pusr', user, 'pusr');