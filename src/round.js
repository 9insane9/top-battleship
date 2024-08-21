const Gameboard = require('./gameboard')
const genRandomLayout = require('./random')

const round = function (randomLayoutFn = genRandomLayout) {
  const boards = {
    player: new Gameboard(),
    ai: new Gameboard(),
  }

  let aiFn = aiAttackFn()
  let gameStarted = false
  let gameOver = false
  let difficultyValue = 0 //lower is easier

  const menu = function() {

    function generateRandomBoard(board) {
      if (gameStarted) throw new Error('Play with what is already on the board!')
      board.initializeBoard()
      randomLayoutFn(board)
      console.log(`Board generated!`)
      return board
    }

    function toggleDifficulty() {
      if (gameStarted) throw new Error('Cannot change difficulty mid game!')

      if (difficultyValue === 0) {
        difficultyValue = 0.02

      } else if (difficultyValue === 0.02) {
        difficultyValue = 0.65

      } else if (difficultyValue === 0.65) {
        difficultyValue = 0
      }
      console.log(`Cheat% set to: ${difficultyValue}`)
    }

    function startGame() {
      if (gameStarted) throw new Error('Game already started!')
      gameStarted = true
      console.log(`Game started!`)
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
    console.log('Playing turn...')

    boards.ai.receiveAttack(playerAttackPos)
    checkIfWin()

    if (!gameOver) {
      aiFn.attack(boards.player, difficultyValue)
      checkIfWin()
    }
  }

  function checkIfWin() {
    let winner = null

    const playerShipsSunk = boards.player.allShipsSunk()
    const aiShipsSunk = boards.ai.allShipsSunk()
  
    if (playerShipsSunk || aiShipsSunk) { 
      gameOver = true
      console.log("Game is over!")
    }
    if (playerShipsSunk) winner = "ai"
    if (aiShipsSunk) winner = "player"
    
    if (winner) {
      console.log(`Winner is ...${winner}!`)
    }

    return winner
  }

  function playAgain() {
    gameStarted = false
    gameOver = false

    boards.player.initializeBoard()
    boards.ai.initializeBoard()

    menu().generateRandomBoard(boards.player)
    menu().generateRandomBoard(boards.ai)
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
function aiAttackFn() { 

  function attack(playerBoard, difficultyValue) {
    let aiAttackPos

    const validCheatPositions = playerBoard.getAllStillOpenShipPositions()
    const valueToBeat = 0.99 - difficultyValue
    const diceResult = Math.random()

    if (diceResult > valueToBeat && validCheatPositions.length > 0) { //if cheating
      console.log(`Valid positions for cheating: ${validCheatPositions}`)
      aiAttackPos = validCheatPositions[Math.floor(Math.random() * validCheatPositions.length)]
      console.log(`Cheating AI attacking at: ${aiAttackPos}`)

    } else { //if not cheating
      do {
        aiAttackPos = Math.floor(Math.random() * 100)
      } while (playerBoard.shotsReceived.includes(aiAttackPos))

      console.log(`Random AI attacking at: ${aiAttackPos}`)
    }

    playerBoard.receiveAttack(aiAttackPos)
    return aiAttackPos
  }

  function getState() {
    return ""
  }
  
  return { attack, getState }
}

module.exports = round