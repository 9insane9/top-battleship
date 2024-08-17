import './style.css'
import { display } from './display.js'
import { audio } from './audio.js'

const round = require('../src/round')

const render = display()
const sound = audio()
const gameRound = round()

const playerGridEl = document.querySelector('.player-grid')
const aiGridEl = document.querySelector('.ai-grid')

document.addEventListener("DOMContentLoaded", () => {
  render.generateGrids()
  render.startWaterAnimation(playerGridEl, aiGridEl)
  render.renderFleet(playerGridEl, gameRound.boards.player)
  render.generateIndicators()
  render.updateIndicators(gameRound)
  sound.initMusicAndButton()

  initEvents(gameRound)
})

function initEvents(gameRound) {
  const boardBtn = document.querySelector('.generate-board-btn')
  const startBtn = document.querySelector('.start-game-btn')
  const backToMenuBtn = document.querySelector('.back-to-menu-btn')

  boardBtn.addEventListener('click', () => {
    sound.playClick()
    gameRound.menu().generateRandomBoard(gameRound.boards.player)
    render.renderFleet(playerGridEl, gameRound.boards.player)
  })

  startBtn.addEventListener('click', () => {
    sound.playStart()
    render.showGameStart()
    start()
  })

  backToMenuBtn.addEventListener('click', () => {
    backToMenuEvent()
  })

  const menuButtonEls = [ boardBtn, startBtn]
  menuButtonEls.forEach((buttonEl) => { buttonEl.addEventListener('mouseenter', () => {
      sound.playHover()
    })})
}

function start() {
  aiGridEl.addEventListener('click', fireShotEvent)

  const aiCellsArr = Array.from(aiGridEl.children)
  aiCellsArr.forEach((aiCell) => {
    aiCell.classList.add('can-aim')
  })

  gameRound.menu().startGame()

  const menu = document.querySelector(".menu") //bye menu
  menu.classList.add('invisible')
}

function fireShotEvent(event) {
  const indexString = event.target.getAttribute('data-index')
  const pos = Number(indexString)

  console.log(`Player attempts to fire at: ${pos}`)
  const aiShotsReceived = gameRound.boards.ai.shotsReceived
  const isNewPosition = !aiShotsReceived.includes(pos)

  console.log(`All shots received by AI: ${aiShotsReceived}`)
 
  if (isNewPosition) {
    console.log(`Firing shot at: ${pos}`)

    gameRound.playTurn(pos) 

    updateDisplay(pos)
    render.updateIndicators(gameRound)
  }

  let gameOver = gameRound.getGameOver()
  if (gameOver) {
    aiGridEl.removeEventListener('click', fireShotEvent)
    Array.from(aiGridEl.children).forEach((aiCell) => { aiCell.classList.remove('can-aim') })

    let winner = gameRound.checkIfWin()
    render.showGameOver(winner)
    sound.playEnd(winner)      
  }
}

function backToMenuEvent() {
  const menuEl = document.querySelector('.menu')
  const gameOverEl = document.querySelector('.game-over')

  console.log(gameOverEl)

  gameOverEl.classList.add('invisible')
  menuEl.classList.remove('invisible')

  resetGame(gameRound)
}

function updateDisplay(pos) {
  const playerShotsReceived = gameRound.boards.player.shotsReceived
  const aiHitPos = playerShotsReceived[playerShotsReceived.length - 1]
  const aiShipOnBoard = gameRound.boards.ai.boardState[pos]
  const aiFleet = gameRound.boards.ai.fleet
  const aiShipInFleet = aiFleet[aiShipOnBoard]

  const playerShipOnBoard = gameRound.boards.player.boardState[aiHitPos]
  const playerFleet = gameRound.boards.player.fleet
  const playerShipInFleet = playerFleet[playerShipOnBoard]

  //on hit for player
  if (aiShipInFleet) {
    sound.playPositive()
    render.shootAnimation(aiGridEl, pos, "player")
    render.startFireAnimation(aiGridEl, pos)
    render.markHitAndRenderShipAnimation(aiGridEl, pos, aiShipInFleet, gameRound)

    //fire around sunk ships here
    fireAroundShipIfSunk(aiGridEl, gameRound.boards.ai, pos)

  } else { //on miss for player
    sound.playNegative()
    render.shootAnimation(aiGridEl, pos, "player")
    render.splashAnimation(aiGridEl, pos)
    setTimeout(() => { render.markMissedShotAnimation(aiGridEl, pos) }, 1000)
    
  }

  setTimeout(() => {

    if (playerShipInFleet) { //ai on hit
      render.shootAnimation(playerGridEl, aiHitPos, "ai")
      render.startFireAnimation(playerGridEl, aiHitPos)
      fireAroundShipIfSunk(playerGridEl, gameRound.boards.player, aiHitPos)
    } else { //ai on miss
      render.shootAnimation(playerGridEl, aiHitPos, "ai")
      render.splashAnimation(playerGridEl, aiHitPos)

      setTimeout(() => { 
        render.markMissedShotAnimation(playerGridEl, aiHitPos)
      }, 1500)
      
    }
  }, 1250)
}

function resetGame(gameRound) {
  gameRound.playAgain()

  render.clearDisplay(playerGridEl, aiGridEl)
  render.renderFleet(playerGridEl, gameRound.boards.player)
  render.updateIndicators(gameRound)
}

//hep
function fireAroundShipIfSunk(gridEl, board, pos) {
  const targetsArr = getSunkShipNewAdjacents(board, pos)

  if (targetsArr.length > 0) {
    targetsArr.forEach((target) => {
      render.splashAnimation(gridEl, target.toString())
    })

    setTimeout(() => { 
      targetsArr.forEach((target) => {
        render.markMissedShotAnimation(gridEl, target.toString())
      }) 
    }, 1000)

    board.shotsReceived.push(...targetsArr) //not here maybe, game state thing
  }
}

//Calculation problem, currently doesnt account of valid adjacent is on previous or next row
// function getSunkShipNewAdjacents(board, pos) {
//   console.log("Checking if adjacents needed...")
//   const alreadyShot = board.shotsReceived
//   const allPotentialCoordinates = []
//   let shipCoordinates = []
//   const shipID = board.boardState[pos]
//   console.log(`Ship is: ${shipID}`)

//   if (shipID) {
//     const ship = board.fleet[shipID]
    
//     if (ship.status.isSunk) { 
//       shipCoordinates = ship.status.position 
//     }
//   }
  
//   if (shipCoordinates.length > 0) {
//     shipCoordinates.forEach((coordinate) => {
//       allPotentialCoordinates.push(coordinate - 11) //top-left
//       allPotentialCoordinates.push(coordinate - 10) //top
//       allPotentialCoordinates.push(coordinate - 9)  //top-right
//       allPotentialCoordinates.push(coordinate - 1)  //left
//       allPotentialCoordinates.push(coordinate + 1)  //right
//       allPotentialCoordinates.push(coordinate + 9)  //bottom-left
//       allPotentialCoordinates.push(coordinate + 10) //bottom
//       allPotentialCoordinates.push(coordinate + 11) //bottom-right
//     })

//     const inBoundsCoordinates = allPotentialCoordinates.filter(coordinate =>
//       coordinate >= 0 && coordinate <= 99
//     )
//     console.log(inBoundsCoordinates)

//     const newAdjacentCoordinates = inBoundsCoordinates.filter(coordinate =>
//       !alreadyShot.includes(coordinate)
//     )

//       console.log(`new sunk adjacents: ${newAdjacentCoordinates}`)
//     return newAdjacentCoordinates
//   }

//   return []
// }

function getSunkShipNewAdjacents(board, pos) {
  console.log("Checking if adjacents needed...");
  const alreadyShot = board.shotsReceived;
  const allPotentialCoordinates = []
  let shipCoordinates = []
  const shipID = board.boardState[pos]
  console.log(`Ship is: ${shipID}`)

  if (shipID) {
    const ship = board.fleet[shipID]

    if (ship.status.isSunk) {
      shipCoordinates = ship.status.position
    }
  }

  if (shipCoordinates.length > 0) {
    // directions: left, right, top, bottom, and diagonals
    const directions = [
      -11, -10, -9, // Top-left, Top, Top-right
      -1,          // Left
      1,           // Right
      9, 10, 11    // Bottom-left, Bottom, Bottom-right
    ]

    shipCoordinates.forEach((coordinate) => {
      directions.forEach((dir) => {
        const newCoordinate = coordinate + dir

        // ensure the new coordinate is within bounds
        const rowDiff = Math.floor(newCoordinate / 10) - Math.floor(coordinate / 10);
        const colDiff = (newCoordinate % 10) - (coordinate % 10)

        // only add the coordinate if it's within the grid bounds and valid
        if (
          newCoordinate >= 0 &&
          newCoordinate <= 99 &&
          Math.abs(rowDiff) <= 1 && // Row difference should be -1, 0, or 1
          Math.abs(colDiff) <= 1 // Column difference should be -1, 0, or 1
        ) {
          allPotentialCoordinates.push(newCoordinate);
        }
      });
    });

    // remove duplicates and filter out already shot positions
    const uniqueCoordinates = Array.from(new Set(allPotentialCoordinates));
    const newAdjacentCoordinates = uniqueCoordinates.filter(
      (coordinate) => !alreadyShot.includes(coordinate)
    )

    console.log(`new sunk adjacents: ${newAdjacentCoordinates}`)
    return newAdjacentCoordinates
  }

  return []
}
