var _U    = require('../../utils');
var Block = require('../../block');

var Item = Block.define({
  parent: Block,
  type: '_item',
  methods: {
    accepts: function (lines) {
      return _U.indentLevel(lines.peak()) >= this.indent;
    },
    consume: function (lines) {
      var next;
      this.prepare(lines);
      do {
        next = new (Block.get(lines))(this);
        this.append(next);
        next.consume(lines);
        lines.trimBlank();
      } while (this.accepts(lines));
    }
  }
});

module.exports = exports = Item;