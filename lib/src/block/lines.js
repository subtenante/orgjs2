var _U = require('../utils');
var _  = _U._;

/**
 * Lines constructor
 * @param {String|Array} text either a string which will be split into lines,
 *                            or an array of lines in reverse order.
 */
var Lines = function (text) {
  if (text.constructor === Lines) {
    this.arr = text.arr;
  } else if (_.isArray(text)) {
    this.arr = text;
  } else if (_.isString(text)) {
    this.arr = text.split(/\r?\n/g).reverse();
  } else {
    this.arr = [];
  }
};

Lines.ensure = function (o) {
  return o.constructor === Lines ? o : new Lines(o);
};

Lines.prototype = {
  length  : function () { return this.arr.length; },
  
  rest    : function () { return this.arr.slice().reverse(); },
  asArray : function () { return this.rest(); },
  
  text    : function () { return this.arr.reverse().join('\n'); },
  asString: function () { return this.text(); },
  
  peak    : function () { return this.arr[this.arr.length - 1]; },
  pop     : function () { return this.arr.pop(); },

  /**
   * Returns a new Lines object containing all lines popped from this, until
   * they do not match the given matcher function/regexp anymore.
   *
   * The lines in the result are really popped from this, so they are not in
   * this anymore.
   * 
   * @param  {Function|RegExp} matcher the matcher
   * @return {Lines}           a new lines object.
   */
  popWhile: function (matcher) {
    var matcherFn = matcher;
    if (_.isRegExp(matcher)) {
      matcherFn = function (str) {
        return str.match(matcher);
      };
    }

    var result = [];
    var line = this.pop();
    while (_.isString(line) && matcherFn(line)) {
      result.push(line);
      line = this.pop();
    }
    if (_.isString(line)) { this.push(line); }
    return new Lines(result.reverse());
  },

  /**
   * Same as popWhile, except that it pops all lines until the match the given
   * function/regexp.
   * 
   * @param  {Function|RegExp} matcher the matcher
   * @return {Lines}           a new lines object.
   */
  popUntil: function (matcher) {
    var matcherFn = function () {return true;};
    if (_.isRegExp(matcher)) {
      matcherFn = function (str) {
        return !str.match(matcher);
      };
    } else if (_.isFunction(matcher)) {
      matcherFn = function (str) {return !matcher(str);};
    }
    return this.popWhile(matcherFn);
  },

  trimBlank: function () {
    return this.popWhile(/^\s*$/);
  },

  properties: function () {
    var result    = {};
    var propRgxp  = _U.rgxp.propLine;
    var propLines = this.popWhile(propRgxp);
    propLines.each(function (l) {
      var m = l.match(propRgxp);
      var name = m[1].toLowerCase();
      var value = m[2];
      result[name] = value;
    });
    return result;
  },

  /**
   * Return the next line which is not 
   * @return {[type]} [description]
   */
  peakOverProperties: function () {
    var lines    = this.asArray();
    var propRgxp = _U.rgxp.propLine;
    var result   = '';
    _.each(lines, function (l) {
      if (!l.match(propRgxp)) { 
        result = l;
        return false;
      }
    });
    return result;
  },

  push: function (arg) {
    if (_.isString(arg)) {
      this.arr.push(arg);
    } else if (_.isArray(arg)) {
      this.arr = this.arr.concat(arg);
    } else {
      this.arr.push('');
    }
  },

  each: function (fn) {
    _.each(this.asArray(), fn);
  }
};

module.exports = exports = Lines;