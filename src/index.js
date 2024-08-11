import './style.css'
import { display } from './display.js'

const round = require('../src/round')

const render = display()
const gameRound = round()

render.generateGrids()

const playerGridEl = document.querySelector('.player-grid')
const aiGridEl = document.querySelector('.ai-grid')

render.startWaterAnimation(playerGridEl, aiGridEl) //startWaterEffect
render.renderFleet(playerGridEl, gameRound.boards.player)

document.addEventListener("DOMContentLoaded", () => {
  initEvents(gameRound)
  render.renderFleet(gameRound.boards.player.boardState)
})

function initEvents(gameRound) {
  const boardBtn = document.querySelector('.generate-board-btn')
  const startBtn = document.querySelector('.start-game-btn')

  boardBtn.addEventListener('click', () => {
    gameRound.menu().generateRandomBoard(gameRound.boards.player)
    render.renderFleet(playerGridEl, gameRound.boards.player)
  })

  startBtn.addEventListener('click', () => {
    start()
  })
}

function start() {
  aiGridEl.addEventListener('click', fireShotEvent)
  gameRound.menu().startGame()

  const menu = document.querySelector(".menu") //bye menu
  menu.style.display = "none"
}

function fireShotEvent(event) {
  const pos = Number(event.target.getAttribute('data-index')) //problem: first time duplicate fires at 0 still
  console.log(pos)
  const aiShotsReceived = gameRound.boards.ai.shotsReceived
  const isNewPosition = !aiShotsReceived.includes(pos)

  console.log(aiShotsReceived)
  console.log(isNewPosition)

  if (isNewPosition) {
    console.log('Firing shot!')

    gameRound.playTurn(pos) 

    updateDisplay(pos)

    let gameOver = gameRound.getGameOver()
    if (gameOver) {
      aiGridEl.removeEventListener('click', fireShotEvent)

      const menu = document.querySelector(".menu") //bye menu
      menu.style.display = "flex"
    }
  } else { return }
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
    render.startFireAnimation(aiGridEl, pos)
    render.markHitAndRenderShipAnimation(aiGridEl, pos, aiShipInFleet, gameRound)
  } else { //on miss for player
    render.splashAnimation(aiGridEl, pos)
    setTimeout(() => { render.markMissedShotAnimation(aiGridEl, pos) }, 1510)
    
  }

  setTimeout(() => {

    if (playerShipInFleet) { //ai on hit
      render.startFireAnimation(playerGridEl, aiHitPos)
    } else { //ai on miss
      render.splashAnimation(playerGridEl, aiHitPos)

      setTimeout(() => { render.markMissedShotAnimation(playerGridEl, aiHitPos) }, 1510)
      
    }
  }, 1000)
}