const Gameboard = require('./gameboard')
const genRandomLayout = require('./random')

const round = function (randomLayoutFn = genRandomLayout) {
  const boards = {
    player: new Gameboard(),
    ai: new Gameboard(),
  }

  const shots = {
    player: [],
    ai: [],
  }

  let gameStarted = false
  let gameOver = false

  const menu = function() {

    function generateRandomBoard(board) {
      if (gameStarted) throw new Error('Play with what is already on the board!')
      board.initializeBoard()
      randomLayoutFn(board)
      return board
    }

    function startGame() {
      if (gameStarted) throw new Error('Game already started!')
      gameStarted = true
    }

    return {
      generateRandomBoard,
      startGame
    }    
  }

  const playTurn = function(playerAttackPos, aiAttackPosFn = randomAiAttackPosFn) {
    if (!gameStarted) throw new Error('Start game first!')
    if (gameOver) throw new Error('Game is over!')
    if (shots.player.includes(playerAttackPos)) throw new Error('Position already shot!')

    shots.player = shots.player.concat(playerAttackPos)
    boards.ai.receiveAttack(playerAttackPos)
    checkIfWin()

    if (!gameOver) {
      let aiAttackPos = aiAttackPosFn(shots.ai)
      shots.ai = shots.ai.concat(aiAttackPos)
      boards.player.receiveAttack(aiAttackPos)
      checkIfWin()
    }
  }

  function checkIfWin() {
    let winner = null

    const playerShipsSunk = boards.player.allShipsSunk()
    const aiShipsSunk = boards.player.allShipsSunk()
  
    if (playerShipsSunk || aiShipsSunk) { gameOver = true }
    if (playerShipsSunk) winner = "ai"
    if (aiShipsSunk) winner = "player"
  
    return winner
  }

  function playAgain() {
    if (!gameStarted) throw new Error(`Play "again"? You haven't even started!`)
    if (gameStarted && !gameOver) throw new Error('Finish current game!')

    menu().generateRandomBoard(boards.player)
    menu().generateRandomBoard(boards.ai)
    gameStarted = false
    gameOver = false
  }

  function getGameOver() {
    return gameOver
  }

  //ai turn
  function randomAiAttackPosFn(aiShots) {
    let aiAttackPos
    do {
      aiAttackPos = Math.floor(Math.random() * 100)
    } while (aiShots.includes(aiAttackPos))

    return aiAttackPos
  }
  /////////

  menu().generateRandomBoard(boards.player)
  menu().generateRandomBoard(boards.ai)

  
  return {
    menu,
    boards,
    shots,
    playTurn,
    getGameOver,
    playAgain
  }
}

module.exports = round