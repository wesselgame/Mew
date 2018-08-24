/**
 * @name Mew#CommandStore
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const date = new Date();
const { readdir, readdirSync } = require('fs');
const { cyan, red, green, yellow, magenta } = require('../../../deps/colors');

const Context = require('../../structures/Discord/Context');
const Collection = require('../../../util/Collection');
const { Collection: erisCollection } = require('eris');

class CommandStore {
  /**
   * @name mew#CommandStore
   * @param {Object} bot - The bot object
   * @returns {Object} bot - The bot object
   * @description Initialize all commands.
   */
  constructor(bot) {
    this.bot = bot;
    this.cooldowns = new erisCollection();
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
        if (err) this.bot.print(1, `[${cyan('Master')}] !! LoadError - ${red(`${err.message}\n${err.stack}`)}`);
        this.bot.print(1, `[${cyan('Discord')}]  >> Loading ${green(files.length)} commands in category ${green(categories[i])}`);
        files.forEach((file) => {
          try {
            this.start(dir, categories[i], file);
          } catch (err) {
            this.bot.print(1, `[${cyan('Master')}] !! LoadError - ${red(`${err.message}\n${err.stack}`)}`);
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
    if (!this.bot.conf['Discord']['Commands'][cmd.options.name]) return;
    
    if (this.bot.cmds.has(cmd.options.name)) this.bot.print(1, `[${cyan('Master')}] !! Duplicate command found - ${red(`${dir}/${category}/${file}`)}`);
    this.bot.cmds.set(cmd.options.name, cmd);
    this.bot.print(2, `[${cyan('Discord')}]  >> Loaded command ${green(cmd.options.name)}`);
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
    let perm;
    let guild;
    let prefix;
    if (msg.author.bot || !this.bot.ready) return;
    
    if (msg.channel.guild) {
      perm = msg.channel.permissionsOf(this.bot.user.id);      
      guild = await this.bot.m.connection.collection('srv').findOne({ serverId: msg.channel.guild.id });
      if (!guild) {
        const query = new this.bot.m['schemas']['srv']({ serverId: msg.channel.guild.id });
        query.save();
        guild = query;
      }
      prefix = new RegExp([
        `^<@!?${this.bot.user.id}> `,
        `^${this.bot.conf['Discord'].prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`,
        `^${guild.prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}`
      ].join('|')).exec(msg.content.toLowerCase());
    } else {
      guild = undefined;
      prefix = /(?:)/.exec(msg.content.toLowerCase());
    }

    if(guild && guild['verification'] && msg.channel.id === guild['verification'].channelId &&
      !msg.member.permission.json.manageMessages &&
      !msg.content.startsWith(prefix ? `${prefix[0]}verify ` : undefined)) return msg.delete();  
    if (!prefix) return;
    if (!this.bot.op(msg.author.id) && guild && guild.blacklist && guild.blacklist.includes(msg.author.id)) return;

    const ctx = new Context(this.bot, msg);
    ctx.setPrefix(prefix[0]);

    const args = msg.content.slice(prefix[0].length).trim().split(/ +/g);
    const cmd = args.shift();
    const command = this.bot.cmds.filter((c) => c.options.name === cmd || c.options.aliases.includes(cmd));
    
    if (command.length > 0) {
      if (command[0].options.ownerOnly && !this.bot.op(msg.author.id)) {
        return msg.channel.createMessage(`${this.bot.ico['OWNER_ONLY']} ${msg.author.mention}, You're missing permissions in order to execute this command`);
      }
      if (command[0].options.guildOnly && msg.channel.type === 1) {
        return msg.channel.createMessage(`${this.bot.ico['GUILD_ONLY']} ${msg.author.mention}, This command can only be used in guilds`);
      }
      if (msg.channel.guild && (command[0].options.permissions && command[0].options.permissions.some(p => !perm.has(p))) ||
        msg.channel.guild && !perm.has('sendMessages')) return;
      if (!this.cooldowns.has(command[0].options.command)) this.cooldowns.set(command[0].options.command, new erisCollection());

      const now = Date.now();
      const timestamps = this.cooldowns.get(command[0].options.command);
      const cooldownAmount = (command[0].options.cooldown) * 1000;

      if (!timestamps.has(msg.author.id)) {
        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
      } else {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return msg.channel.createMessage({
            embed: {
              color: this.bot.col['COOLDOWN'],
              description: `${this.bot.ico['COOLDOWN']} ${msg.author.mention}, This command is on cooldown for another **${timeLeft.toFixed(1)} ${Math.floor(timeLeft) === 0 || Math.floor(timeLeft) > 1 ? 'seconds': 'second'}**`
            }
          });
        }

        timestamps.set(msg.author.id, now);
        setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
      }

      try {
        await command[0].execute(ctx, args, guild);
        this.bot.print(3, `[${magenta('Debug')}]    >> event "${yellow('COMMAND_EXECUTE')}" fired`);
        this.bot.print(3, `[${cyan(`Shard #${msg.channel.guild ? msg.channel.guild.shard.id : 0}`)}] >> Command '${command[0].options.name}' executed by ${yellow(msg.author.id)}`);
      } catch (err) {
        this.bot.print(1, `[${cyan('Master')}] !! CommandError - ${red(`${err.message}\n${err.stack}`)}`);
        msg.channel.createMessage({
          embed: {
            color: this.bot.col['ERROR'],
            description: [
              `${this.bot.ico['ERROR']['0']} ${msg.author.mention}, an error occured while executing this command`,
              `${this.bot.ico['ERROR']['1']} If this problem keeps occuring, consider joining ***https://discord.gg/SV7DAE9*** and posting your problem there`,
              `\`\`\`ini\n[ Error Information ]\nMessage = "${err.message.replace('"', '\\"')}"\nCode = "${err.code}"\`\`\``
            ].join('\n')
          }
        });
      }
    }
  }
};

module.exports = CommandStore;