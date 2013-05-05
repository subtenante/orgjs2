var _U      = require('./utils');
var Org     = require('./core');
var Block   = require('./block/block');
var Section = require('./block/section');
var Config  = require('./config');
var Lines   = require('./block/lines');

var Document = Block.define({
  parent: Section,
  type: 'document',
  methods: {}
});

Document.includes = function (txt, basepath) {
  // TODO: treat includes.
  return txt;
};

Document.parser = function (org) {
  org = org || new Org();
  var conf = org.conf || Config.defaults;
  var numspace = +conf.get('tabSize');
  var tabspace = _U.repeat(' ', numspace);
  return function (txt) {
    txt = txt.replace(/\t/g, tabspace);
    txt = Document.includes(txt);
    var d = new Document(org, null);
    d.consume(new Lines(txt));  
    return d;
  };
};

module.exports = exports = Document;