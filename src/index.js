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
  const difficultyBtn = document.querySelector('.toggle-difficulty')
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

  difficultyBtn.addEventListener('click', () => {
    toggleDifficultyEvent()
  })

  const menuButtonEls = [ boardBtn, startBtn, difficultyBtn] //add hover sound
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

  gameOverEl.classList.add('invisible')
  menuEl.classList.remove('invisible')

  resetGameEvent(gameRound)
}

function toggleDifficultyEvent() {
  sound.playDifficulty()
  render.toggleDifficultyDisplay()
  gameRound.menu().toggleDifficulty()
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
    autoFireAtPointless(aiGridEl, gameRound.boards.ai, pos)

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
      autoFireAtPointless(playerGridEl, gameRound.boards.player, aiHitPos)
    } else { //ai on miss
      render.shootAnimation(playerGridEl, aiHitPos, "ai")
      render.splashAnimation(playerGridEl, aiHitPos)

      setTimeout(() => { 
        render.markMissedShotAnimation(playerGridEl, aiHitPos)
      }, 1500)
      
    }
  }, 1250)
}

function resetGameEvent(gameRound) {
  gameRound.playAgain()

  render.clearDisplay(playerGridEl, aiGridEl)
  render.renderFleet(playerGridEl, gameRound.boards.player)
  render.updateIndicators(gameRound)
}

//hep - refactor and split into appropriate places
function autoFireAtPointless(gridEl, board, pos) {
  const targetsArr = getPointlessPositions(board, pos)
  board.shotsReceived.push(...targetsArr)

  if (targetsArr.length > 0) {
    targetsArr.forEach((target) => {
      render.splashAnimation(gridEl, target.toString())
    })

    setTimeout(() => { 
      targetsArr.forEach((target) => {
        render.markMissedShotAnimation(gridEl, target.toString())
      }) 
    }, 1000)
  }
}

function getPointlessPositions(board, pos) {
  //it's "functional" but unnecessarily complicated
  console.log("Getting pointless positions...")
  
  const alreadyShot = board.shotsReceived
  const allPotentialCoordinates = []
  const shipID = board.boardState[pos]
  const ship = board.fleet[shipID]
  let sunkShipCoordinates = [] // initialize
  
  // console.log(`Ship is: ${shipID}`)

  if (ship.status.isSunk) {
    sunkShipCoordinates = ship.status.position // if sunk, get coordinates
  }
  
  // Scenario 1 - IF SHIP IS SUNK
  if (sunkShipCoordinates.length > 0) {
    console.log('Ship was sunk, getting all adjacents');
    
    const directions = [
      -11, -10, -9,  // Top-left, Top, Top-right
      -1,            // Left
      1,             // Right
      9, 10, 11      // Bottom-left, Bottom, Bottom-right
    ];

    sunkShipCoordinates.forEach((coordinate) => {
      directions.forEach((dir) => {
        const newCoordinate = coordinate + dir;

        // ensure the new coordinate is within bounds
        const rowDiff = Math.floor(newCoordinate / 10) - Math.floor(coordinate / 10);
        const colDiff = (newCoordinate % 10) - (coordinate % 10);

        // only add the coordinate if it's within the grid bounds
        if (
          newCoordinate >= 0 &&
          newCoordinate <= 99 &&
          Math.abs(rowDiff) <= 1 &&  // Row difference should be -1, 0, or 1
          Math.abs(colDiff) <= 1     // Column difference should be -1, 0, or 1
        ) {
          allPotentialCoordinates.push(newCoordinate);
        }
      });
    });
  
  // Scenario 2 - ship wasn't sunk
  } else if (sunkShipCoordinates.length === 0) {
    // hit diagonals, still need to account for rowDiff and colDiff
    const directions = [-11, -9, 9, 11]; // Diagonal directions only

    directions.forEach((dir) => {
      const newCoordinate = pos + dir;

      const rowDiff = Math.floor(newCoordinate / 10) - Math.floor(pos / 10);
      const colDiff = (newCoordinate % 10) - (pos % 10);

      if (
        newCoordinate >= 0 &&
        newCoordinate <= 99 &&
        Math.abs(rowDiff) === 1 && 
        Math.abs(colDiff) === 1
      ) {
        allPotentialCoordinates.push(newCoordinate);
      }
    });
  }
      
  // then hit adjacents in all situations just in case, every time
  const adjacentHits = [
    pos - 1,  // Left
    pos + 1,  // Right
    pos - 10, // Top
    pos + 10  // Bottom
  ];

  adjacentHits.forEach((adjacent) => {
    if (alreadyShot.includes(adjacent) && board.boardState[adjacent]) { 
      // if there's an adjacent hit on the left/right, shoot up/down
      if (adjacent === pos - 1 || adjacent === pos + 1) {
        const up = pos - 10;
        const down = pos + 10;
        if (up >= 0) allPotentialCoordinates.push(up);
        if (down <= 99) allPotentialCoordinates.push(down);
      }

      // If there's an adjacent hit on the top/bottom, shoot left/right
      if (adjacent === pos - 10 || adjacent === pos + 10) {
        const left = pos - 1;
        const right = pos + 1;
        if (left >= 0 && Math.floor(left / 10) === Math.floor(pos / 10)) {       
          allPotentialCoordinates.push(left);
        }
        if (right <= 99 && Math.floor(right / 10) === Math.floor(pos / 10)) {
          allPotentialCoordinates.push(right);
        }
      }
    }
  });
  
  // After all done: remove duplicates and filter out already shot positions
  const uniqueCoordinates = Array.from(new Set(allPotentialCoordinates));
  const newPointless = uniqueCoordinates.filter(
    (coordinate) => !alreadyShot.includes(coordinate)
  );

  console.log(`New pointless positions to shoot: ${newPointless}`);
  return newPointless;
}
