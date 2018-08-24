/**
 * @name Mew#Core:PlugClient
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const mp = require('miniplug')();
const { blue, red, green } = require('../../deps/colors');

const DBmanager = require('../managers/PlugDJ/DBmanager');
const EventStore = require('../stores/PlugDJ/EventStore');
const CommandStore = require('../stores/PlugDJ/CommandStore');

const util = require('../../util/Util');
const Collection = require('../../util/Collection');

class MewPlug {
  /**
   * @name MewClient#PlugDJ
   * @param {Object} options - The options for the client to use
   * @returns {Object} MewClient - The client that has been created
   * @description Create an instance of mew
   */
  constructor(options = {}) {

    // Details
    mp.mail = options['mail'] ? options['mail'] : null;
    mp.pass = options['pass'] ? options['pass'] : null;
    mp.room = options['room'] ? options['room'] : null;

    // Collections
    mp.cmds = new Collection();
    mp.cache = new Collection();
    mp.events = new Collection();

    // Global functions
    mp.op = this.op;
    mp.launch = this.launch;
    mp.destroy = this.destroy;

    // Utility functions
    mp.util = util;
    mp.print = util.print;
    mp.Collection = Collection;
    
    // Global variables
    mp.ua = options.ua ? options.ua : undefined;
    mp.pkg = options.pkg ? options.pkg : undefined;
    mp.conf = options.config ? options.config : undefined;

    // Managers and stores
    mp.db = new DBmanager(options['db']);
    mp.eventStore = new EventStore(mp);
    mp.commandStore = new CommandStore(mp);
  }

  /**
   * @name MewClient#LaunchPlug
   * @param {String} events - The directory of all events
   * @param {String} commands - The directory of all commands
   * @returns {Object} MewClient - The client that has been created
   * @description Launches the client, making it connect to the database,
   * run the given stores and connects to plugDJ.
   */
  async launch(events, commands) {
    // Launch the stores
    mp.eventStore.run(events);
    mp.commandStore.run(commands);
    
    // Set a global variable for the database
    mp.m = mp.db.launch();
    // Connect the client to plugDJ
    mp.connect({
      email: mp.mail,
      password: mp.pass
    })
      .then(() => {
        mp.print(1, `[${blue('PlugDJ')}]   >> Connecting to websocket`);
        mp.print(1, `[${blue('PlugDJ')}]   >> Joining room "${green(mp.room)}"`);
        
        // Join room
        mp.join(mp.room).then(() => {
          mp.print(1, `[${blue('PlugDJ')}]   >> Joined room "${green(mp.room)}"`);
        }).catch((err) => {
          mp.print(1, `[${blue('PlugDJ')}]   !! Failed to join room "${green(mp.room)}" - ${red(`${err.message}\n${err.stack}`)}`);
          this.destroy(1);
        });
      });
  }

  /**
   * @name MewClient#OpPlug
   * @param {String} UserID - The user ID to check
   * @returns {Boolean} OP - True if the user has permissions
   * @description Check if someone has permissions to execute
   * restricted commands. 
   */
  op(id) { return mp.conf['PlugDJ']['op'].includes(id); }

  /**
   * @name MewClient#DestroyPlug
   * @param {Integer} code - the exit code
   * @returns {Object} trace - the destroy callback
   * @description Destroys the client and exits all connected
   * services.
   */
  destroy(code = 0) {
    let trace = { success: false, code: code };
    mp.print(1, `[${blue('PlugDJ')}]   >> Disconnecting from websocket`);
    try {
      if (code === 0) trace.success = true;
      else trace.success = false;
    } catch (err) {
      trace.code = err.code;
      trace.success = false;
      trace.err = {
        code: err.code,
        message: err.message,
        stack: err.stack
      };
    }
    mp.print(1, `[${blue('PlugDJ')}]   >> Destroy callback - ${red(trace)}`);
    process.exit(trace.code);
  }
};

module.exports = MewPlug;