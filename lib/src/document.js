var _U      = require('./utils');
var Block   = require('./block');
var Content = require('./block/content');
var Section = require('./block/section');
var Config  = require('./config');
var Lines   = require('./block/lines');

var Include = require('./include');

var cacheProp = function (propName) {
  var cacheName = '_' + propName;
  return function (prop) {
    if (prop !== void 0) {
      this[cacheName] = prop;
      return null;
    }
    else {
      var tmp = this[cacheName];
      this[cacheName] = null;
      return tmp;
    }
  };
};

var Document = Block.define({
  parent: Section,
  type: 'document',
  methods: {
    caption: cacheProp('caption'),
    captionShort: cacheProp('captionShort'),
    label: cacheProp('label'),
    init: function (org) {
      this.footnotes = [];
      this.org = org;
      delete this.parent;
    },
    declareFootnote: function (fndef) {
      var number = this.footnotes.length;
      this.footnotes[number] = fndef;
      fndef.number = number + 1;
    },
    footnoteByName: function (name) {
      var fn;
      _.each(this.footnotes, function (c) { 
        if (c.name === name) { fn = c; return false; }
      });
      return fn;
    }
  }
});

Document.parser = function (org) {
  org = org || new (require('./core'))();
  
  var conf = org.conf || Config.defaults;
  var numspace = +conf.get('tabSize');
  var tabspace = _U.repeat(' ', numspace);

  return function (txt) {
  
    var d = new Document(org);
    txt = new Include(d).replace(txt);
    txt = txt.replace(/\t/g, tabspace);
  
    var lines = new Lines(txt);
    lines.trimBlank();
    d.setProperties(lines.properties());
    d.consume(new Lines(txt));  
  
    return d;
  };
};

module.exports = exports = Document;