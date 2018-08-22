/**
 * @name Mew#PermissionUtil
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

const { Constants } = require('eris');

class PermissionUtil {
  static resolve(permission) {
    if (typeof permission === 'number' && permission >= 0) return permission;
    if (permission instanceof Array) return permission.map(p => this.resolve(p)).reduce((prev, p) => prev | p, 0);
    if (typeof permission === 'string') return Constants.permission[permission];
    throw new RangeError("Invalid permission");
  }
};

module.exports = PermissionUtil;