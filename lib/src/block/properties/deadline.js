var _U      = require('../../utils');
var Block   = require('../../block');

var rgxp = /^\s*DEADLINE: <(\d{4}-\d\d-\d\d) [A-Z]{3}>\s*$/ig;

var Deadline = Block.define({
  type: 'deadline',
  match: function (lines) {
    return (_U.peak(lines) || '').match(rgxp);
  },
  methods: {
    consume: function (lines) {
      var line = lines.pop();
      this.raw = line;
    }
  }
});

module.exports = exports = Deadline;