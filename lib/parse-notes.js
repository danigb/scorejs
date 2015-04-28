
module.exports = function(time, notes) {
  return parse(time, tokenize(notes));
}

function parse(time, tokens) {
  var r = /([abcdefgr])([+|-]*)(\d+)/;
  return tokens.map(function(token) {
    var m = r.exec(token);
    return m;
  });
}

function tokenize(notes) {
  return notes
    .replace(/\s*([abcdefgr])/, function(a, b) { return b; })
    .split(' ');

}
