/**
 * @name mew#DBmanager
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const mongoose = require('mongoose');
const { print } = require('../../../util/Util');
const { blue, green, red } = require('../../../deps/colors');

const schemas = require('../../structures/PlugDJ/DBschemas');

class DBmanager {
  /**
   * @name mew#dbmanager
   * @param {String} uri - The uri for the db
   * @returns {Object} db - The db that connected
   * @description Connect to a db
   */
  constructor(uri = 'mongodb://localhost:27017/mew') {
    this.uri = uri;
  }

  /**
   * @name mew#dbmanager:launch
   * @param {String} uri - The uri to launch the manager on
   * @returns {Object} d - The db that connected
   * @description Connects to the db
   */
  launch(uri = this.uri) {
    mongoose.Promise = global.Promise;
    mongoose.schemas = schemas;

    print(1, `[${blue('PlugDJ')}]   >> Connecting to ${green(uri)}`);
    mongoose.connect(uri, { useNewUrlParser: true });

    mongoose.connection.on('connected', () => print(1, `[${blue('PlugDJ')}]   >> Connected to "${green(uri)}"`));
    mongoose.connection.on('error', (err) => {
      print(1, `[${blue('PlugDJ')}]   !! ConnectionError - ${red(`${err.message}\n${err.stack}`)}`);
      process.exit(1);
  });
    this.db = mongoose;
    return mongoose;
  }

  /**
   * @name mew#dbmanager:destroy
   * @param {Integer} code - the exit code
   * @returns {Object} trace - the destroy callback
   * @description Destroys the database connection
   */
  destroy(code = 0) {
    let trace = { success: false, code: code };
    print(1, `[${blue('PlugDJ')}]   >> Disconnecting from database`);
    try {
      mongoose.connection.close(() => {
        trace.success = true;
      });
    } catch(err) {
      trace.code = err.code;
      trace.success = false;
      trace.err = {
        code: err.code,
        message: err.message,
        stack: err.stack
      };
    }
    print(1, `[${blue('PlugDJ')}]   >> Destroy callback - ${red(trace)}`);
  }
};

module.exports = DBmanager;