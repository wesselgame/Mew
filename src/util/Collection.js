/**
 * @name Mew#Collection
 * @author Wessel Tip <discord@go2it.eu>
 * @license GPL-3.0 
 */

class Collection extends Map {
  constructor() {
    super();
  }

  filter(callback) {
    let result = [];
    const all = Array.from(this.values());
    for (let i = 0; i < all.length; i++) {
      if (callback(all[i])) result.push(all[i]);
    }

    return result;
  }

  map(callback) {
    const values = Array.from(this.values());
    let result = [];
    for (let i = 0; i < values.length; i++) {
      result.push(callback(values[i]));
    }

    return result;
  }
};

module.exports = Collection;