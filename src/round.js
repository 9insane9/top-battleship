const Gameboard = require('./gameboard')
const genRandomLayout = require('./random')

const round = function (randomLayoutFn = genRandomLayout) {
  const player1Gameboard = new Gameboard()
  const player2Gameboard = new Gameboard()
  const player1FiredShots = []
  const player2FiredShots = []
  let currentPlayer = null
  let gameMode = null

  // if (gameMode !== null) {
  //   initBoardPopulation()
  // }

  function selectGameMode(mode) {
    if (mode !== 'ai' && mode !== 'pvp') {
      throw new Error('Invalid game mode!')
    } 
    gameMode = mode
  }

  function getGameMode() {
    return gameMode
  }

  function populateGameboard(playerBoard, populateMode) {

  }
  
  return {
    selectGameMode,
    getGameMode
  }
}

module.exports = round
