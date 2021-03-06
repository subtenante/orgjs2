var _U    = require('../../utils');
var Block = require('../../block');

var fndefRgxp = /^(\s*)\[(\d+|fn:.+?)\]\s*/;

var FnDef = Block.define({
  parent: Block,
  type: 'fndef',
  match: function (lines, parent) {
    return (_U.peak(lines) || "").match(fndefRgxp);
  },
  methods: {
    accepts: function (lines) {
      var line = lines.peak();
      var indent = _U.indentLevel(line);
      return indent >= this.indent;
    },
    prepare: function (lines) {
      var line = lines.pop();
      // Register the footnote in the current document.
      var m = line.match(fndefRgxp);
      this.name = m[2].replace(/^fn:/, '');
      this.document().declareFootnote(this);
      // Remove the footnote declaration to allow sub-nodes parsing.
      line = line.replace(fndefRgxp, '$1');
      lines.push(line);
    },
    consume: function (lines) {
      var line = lines.peak();
      this.indent = _U.indentLevel(line);
      this.prepare(lines);
      var linebreak = 0;
      do {
        var next = new (Block.get(lines))(this);
        this.append(next);
        next.consume(lines);
        linebreak = (lines.length() === 0) || lines.trimBlank().length() > 0;
      } while (linebreak === 0 && this.accepts(lines));
    }
  }
});

module.exports = exports = FnDef;