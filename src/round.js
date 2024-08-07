const Gameboard = require('./gameboard')
const genRandomLayout = require('./random')
const ai = require('./ai')

const round = function (randomLayoutFn = genRandomLayout) {
  const boards = {
    player: new Gameboard(),
    ai: new Gameboard(),
  }

  let aiFn = randomAiAttackPosFn() //set default difficulty
  let difficulty = "random"
  let gameStarted = false
  let gameOver = false

  const menu = function() {

    function generateRandomBoard(board) {
      if (gameStarted) throw new Error('Play with what is already on the board!')
      board.initializeBoard()
      randomLayoutFn(board)
      return board
    }

    function toggleDifficulty() {
      if (gameStarted) throw new Error('Cannot change difficulty mid game!')
      difficulty === "random" ? difficulty = "ai" : difficulty = "random"
      difficulty === "random" ? aiFn = ai() : aiFn = randomAiAttackPosFn()
      console.log(`difficulty set to ${difficulty}`)
    }

    function startGame() {
      if (gameStarted) throw new Error('Game already started!')
      gameStarted = true
    }

    return {
      generateRandomBoard,
      toggleDifficulty,
      startGame
    }    
  }

  const playTurn = function(playerAttackPos) {
    if (!gameStarted) throw new Error('Start game first!')
    if (gameOver) throw new Error('Game is over!')
    if (boards.ai.shotsReceived.includes(playerAttackPos)) throw new Error('Position already shot!')

    boards.ai.receiveAttack(playerAttackPos)
    checkIfWin()

    if (!gameOver) {
      aiFn.attack(boards.player)
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

  menu().generateRandomBoard(boards.player)
  menu().generateRandomBoard(boards.ai)

  function getAiState() {
    let state = aiFn.getState()
    return state
  }

  
  return {
    menu,
    boards,
    playTurn,
    getGameOver,
    checkIfWin,
    playAgain, 
    getAiState
  }
}


//ai turn
function randomAiAttackPosFn() {

  function attack(playerBoard) {
    let aiAttackPos
    do {
      aiAttackPos = Math.floor(Math.random() * 100)
    } while (playerBoard.shotsReceived.includes(aiAttackPos))

    playerBoard.receiveAttack(aiAttackPos)
    console.log(playerBoard.shotsReceived)
    console.log(`RandomAi attack performed at ${aiAttackPos}`)

    return aiAttackPos
  }

  function getState() {
    return "no state, dis random"
  }
  
  return { attack, getState }
}
/////////

module.exports = round