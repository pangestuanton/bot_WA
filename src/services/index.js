const media = require('./media.service');
const ai = require('./ai.service');
const { createGroupService } = require('./group.service');
const { createGameService } = require('./game.service');
const tts = require('./tts.service');
const helper = require('../utils/helper.service');
const lyric = require('./lyric.service');
const currency = require('./currency.service');
const weather = require('./weather.service');

function createServices({ config, logger, repositories }) {
  return {
    media,
    ai,
    tts,
    helper,
    lyric,
    currency,
    weather,
    group: createGroupService({ config, logger, repositories }),
    games: createGameService({ config, logger, repositories })
  };
}

module.exports = { createServices };
