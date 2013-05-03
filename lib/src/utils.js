require('./shim');
var _ = require('lodash');

var _U = {
  
  false: function () { return false; },

  ensure: function (obj, def) {
    return (obj || def || {});
  },

  blank: function(str){
    // Valid only for strings and arrays
    return !str || str == 0;
  },

  notBlank: function(str){
    // Valid only for strings and arrays
    return !this.blank(str);
  },

  peak: function (lines) {
    return  lines.peak ? lines.peak() : "" + lines;
  },

  indentLevel: function (line){
    return /^ */.exec(line || "")[0].length;
  },

  /**
   * Creates an array of lines to be parsed. The lines are in reverse order.
   * This means that in order to access the first line to parse, use lines.pop().
   * 
   * @param  {String} text the string to make lines out of
   * @return {Array} the lines in reverse order
   */
  lines: function (text) {
    return text.split(/\r?\n/g).reverse();
  },

  /**
   * Builds a parsing state object, with the last parsed object and the rest of
   * the lines to parse.
   * @param  {Object} node  the last object parsed
   * @param  {Array}  lines the rest of the lines to parse
   * @return {Object} 
   */
  state: function (node, lines) {
    return {
      "node" : node,
      "lines": lines
    };
  },

  /**
   * Build the prototype of the given Constructor with the functions of the
   * Parent prototype, and the given functions in the fns object.
   *
   * @param  {Function} Constr a constructor function
   * @param  {Function} Parent the parent constructor function
   * @param  {Object}   fns    the functions to add, specific to Constr
   * @return {Object} the new Constr prototype
   */
  extendProto: function (Constr, Parent, fns, args) {
    return Constr.prototype = _.assign({}, Parent.prototype, Constr.prototype, fns);
  },

  /**
   * Provides an incrementing function.
   * @return {Function} A function returning an integer incremented at each call.
   */
  incrementor: function () { var i = 0; return function(){ return ++i; }; },

  /** 
   * Repeats the given string n times.
   */
  repeat: function(str, times){
    var result = [];
    for(var i=0; i<times; i++){
      result.push(str);
    }
    return result.join('');
  },

  /**
   * Applies a function for each element of the given array or object
   */
  each: function(arr, fn){
    var name, length = arr.length, i = 0, isObj = length === undefined;
    if ( isObj ) {
      for ( name in arr ) {
        if ( fn.call( arr[ name ], arr[ name ], name ) === false ) {break;}
      }
    } else {
      if(!length){return;}
      for ( var value = arr[0];
        i < length && fn.call( value, value, i ) !== false;
        value = arr[++i] ) {}
    }
  },

  /**
   * Applies the given function for each element of the given array or
   * object, and returns the array of results
   */
  map: function(arr, fn){
    var result = [];
    this.each(arr, function(val, idx){
      var mapped = fn.call(val, val, idx);
      if (mapped !== null){result.push(mapped);}
    });
    return result;
  },

  /** 
   * Applies the given function for each element of the given array or
   * object, and returns the array of filtered results
   */
  filter: function(arr, fn){
    var result = [];
    this.each(arr, function(val, idx){
      var mapped = fn.call(val, val, idx);
      if (mapped){result.push(val);}
    });
    return result;
  }
};

/**
 * An easily callable incrementor.
 * @type {Function}
 */
_U.id = _U.incrementor();

module.exports = exports = _U;