'use strict';

var Score = require('./score.js')();
Score.use(require('./core/time.js'));
Score.use(require('./core/musical.js'));
Score.use(require('./core/select.js'));
module.exports = Score;
