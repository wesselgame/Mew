/**
 * @name Mew#Core:DiscordClient
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const { Client: Eris } = require('eris');

const DBmanager = require('../managers/Discord/DBmanager');
const EventStore = require('../stores/Discord/EventStore');
const CommandStore = require('../stores/Discord/CommandStore');
const RedditManager = require('../managers/Discord/RedditManager');

const path = require('path');
const { cyan, red } = require('../../deps/colors');

const util = require('../../util/Util');
const Collection = require('../../util/Collection');
const PermissionUtil = require('../../util/PermissionUtil');

class MewDiscord extends Eris {
  /**
   * @name MewClient#Discord
   * @param {Object} options - The options for the client to use
   * @returns {Object} MewClient - The client that has been created
   * @description Create an instance of mew
   */
  constructor(options = { token: undefined, db: 'mongodb://127.0.0.1:27017/mew' }) {
    super(options.token, options.clientOptions);

    // Collections
    this.cmds = new Collection();
    this.cache = new Collection();
    this.events = new Collection();

    // Managers and stores
    this.db = new DBmanager(options.db);
    this.eventStore = new EventStore(this);
    this.commandStore = new CommandStore(this);

    // Utility functions
    this.util = util;
    this.print = util.print;
    this.Collection = Collection;
    
    // Global variables
    this.ua = options.ua ? options.ua : undefined;
    this.pkg = options.pkg ? options.pkg : undefined;
    this.col = options.colors ? options.colors : undefined;
    this.ico = options.emojis ? options.emojis : undefined;
    this.conf = options.config ? options.config : undefined;
  }

  /**
   * @name MewClient#LaunchDiscord
   * @param {String} events - The directory of all events
   * @param {String} commands - The directory of all commands
   * @returns {Object} MewClient - The client that has been created
   * @description Launches the client, making it connect to the database,
   * run the given stores and connects to discord.
   */
   async launch(events, commands) {
    // Launch the stores
    this.eventStore.run(events);
    this.commandStore.run(commands);
    
    // Set a global variable for the database
    this.m = this.db.launch();
    // Connect the client to discord
    this.connect()
      .then(async() => {
      this.print(1, `[${cyan('Discord')}]  >> Connecting shards to websockets`);
      
      // Set reddit feeds
      const stream = await this.m.connection.collection('srv').find({ 'reddit.enabled': true }).stream();
      stream.on('data', (g) => {
        const r = new RedditManager(this, `https://reddit.com/r/${g['reddit'].subreddit}`);
        r.startfeed(g['reddit'].channel, this.conf['ratelimit'], g['reddit'].reaction ? g['reddit'].reaction : undefined);
      });
    });
  }
  
  /**
   * @name MewClient#OpDiscord
   * @param {String} UserID - The user ID to check
   * @returns {Boolean} OP - True if the user has permissions
   * @description Check if someone has permissions to execute
   * restricted commands. 
   */
  op(id) { return this.conf['Discord'].op.includes(id); }
  
  /**
   * @name MewClient#GatherInviteDiscord
   * @param {String} permission - The permissions to fetch
   * @returns {String} inviteLink - The resolved invite link
   * @description Returns an invite link with the given permissions.
   */
  gatherInvite(permission) {
    permission = PermissionUtil.resolve(permission);
    return `https://discordapp.com/oauth2/authorize?client_id=${this.user.id}&scope=bot&permissions=${permission}`;
  }
  
  /**
   * @name MewClient#DestroyDiscord
   * @param {Integer} code - the exit code
   * @returns {Object} trace - the destroy callback
   * @description Destroys the client and exits all connected
   * services.
   */
  destroy(code = 0) {
    let trace = { success: false, code: code };
    this.print(1, `[${cyan('Discord')}]  >> Disconnecting shards from websockets`);
    try {
      this.disconnect({ reconnect: false });
      trace.success = true;
    } catch (err) {
      trace.code = err.code;
      trace.success = false;
      trace.err = {
        code: err.code,
        message: err.message,
        stack: err.stack
      };
    }
    this.print(1, `[${cyan('Discord')}]  >> Destroy callback - ${red(trace)}`);
    process.exit(trace.code);
  }
};

module.exports = MewDiscord;