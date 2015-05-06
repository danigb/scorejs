
module.exports = function(Score) {
  Score.fn.walkingBass = function() {
    return this.filter('type', 'chord').map(function(e) {

    });
  }
}
