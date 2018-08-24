/**
 * @name Mew#CommandStore
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const { readdir, readdirSync } = require('fs');
const { blue, red, green, yellow, magenta } = require('../../../deps/colors');

const Context = require('../../structures/PlugDJ/Context');

class CommandStore {
  /**
   * @name mew#CommandStore
   * @param {Object} bot - The bot object
   * @returns {Object} bot - The bot object
   * @description Initialize all commands.
   */
  constructor(bot) {
    this.bot = bot;
  }

  /**
   * @name mew#CommandStore:run
   * @param {String} dir - The directory of all commands
   * @returns {Object} callback - The callback of the store
   * @description Load all commands
   */
  async run(dir) {
    const categories = await readdirSync(dir);

    for (let i = 0; i < categories.length; i++) {
      readdir(`${dir}/${categories[i]}`, (err, files) => {
        if (err) this.bot.print(1, `[${blue('PlugDJ')}]   !! LoadError - ${red(`${err.message}\n${err.stack}`)}`);
        this.bot.print(1, `[${blue('PlugDJ')}]   >> Loading ${green(files.length)} commands in category ${green(categories[i])}`);
        files.forEach((file) => {
          try {
            this.start(dir, categories[i], file);
          } catch (err) {
            this.bot.print(1, `[${blue('PlugDJ')}]   !! LoadError - ${red(`${err.message}\n${err.stack}`)}`);
          }
        });
      });
    }
  }

  /**
   * @name mew#CommandStore:StartCommand
   * @param {String} dir - The directory of the command
   * @returns {Object} callback - The callback of the store
   * @description Load all events
   */
  start(dir, category, file) {
    const cmd = new(require(`${dir}/${category}/${file}`))(this.bot);
    cmd.options.location = dir;
    
    if (!cmd.options.enabled) return;
    if (!this.bot.conf['PlugDJ']['Commands'][cmd.options.name]) return;
    
    if (this.bot.cmds.has(cmd.options.name)) this.bot.print(1, `[${blue('PlugDJ')}]   !! Duplicate command found - ${red(`${dir}/${category}/${file}`)}`);
    this.bot.cmds.set(cmd.options.name, cmd);
    this.bot.print(2, `[${blue('PlugDJ')}]   >> Loaded command ${green(cmd.options.name)}`);
  }

  reloadCommand(command) {
    const cmd = this.bot.cmds.get(command);
    if (!cmd) return false;
    
    const dir = cmd.options.location;
    this.bot.cmds.delete(command);
    delete require.cache[require.resolve(dir)];
    this.start(cmd.options.location);
    return true;
  }

  /**
   * @name mew#CommandStore:handleCommand
   * @param {Object} msg - The message object
   * @returns {Object} callback - The callback of the command ran
   * @description Execute a command
   */
  async handleCommand(msg) {
    let room;
    let prefix = new RegExp(`^<@!?${this.bot.user.id}> |^${this.bot.conf['PlugDJ'].prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`)
      .exec(msg.message);
    if (!prefix) return;

    room = await this.bot.m.connection.collection('rooms').findOne({ roomName: this.bot.conf['PlugDJ'].room });
    if (!room) {
      const query = new this.bot.m['schemas']['srv']({ roomName: this.bot.conf['PlugDJ'].room });
      await query.save();
      room = query;
    }
    if (!this.bot.op(msg.user.id) && room.blacklist.includes(msg.user.id)) return;

    const ctx = new Context(this.bot, msg);
    ctx.setPrefix(this.bot.conf['PlugDJ'].prefix);
    const args = msg.message.slice(prefix[0].length).trim().split(/ +/g);
    const cmd = args.shift();
    const command = this.bot.cmds.filter((c) => c.options.name === cmd || c.options.aliases.includes(cmd));
    
    if (command.length > 0) {
      if (command[0].options.ownerOnly && !this.bot.op(ctx.author.id)) {
        return this.bot.chat(`[${msg.user}] You're missing permissions in order to execute this command`);
      }

      try {
        await command[0].execute(ctx, args, room);
        this.bot.print(3, `[${blue('PlugDJ')}]   >> Command '${command[0].options.name}' executed by ${yellow(msg.user.id)}`);
      } catch (err) {
        this.bot.print(1, `[${blue('PlugDJ')}]   !! CommandError - ${red(`${err.message}\n${err.stack}`)}`);
        this.bot.chat(`[${msg.user}] an error occured while executing this command`);
      }
    }
  }
};

module.exports = CommandStore;