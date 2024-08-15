import './style.css'
import { display } from './display.js'
import { audio } from './audio.js'

const round = require('../src/round')

const render = display()
const sound = audio()
const gameRound = round()

const playerGridEl = document.querySelector('.player-grid')
const aiGridEl = document.querySelector('.ai-grid')

render.startWaterAnimation(playerGridEl, aiGridEl) //startWaterEffect

document.addEventListener("DOMContentLoaded", () => {
  render.generateGrids()
  render.renderFleet(playerGridEl, gameRound.boards.player)
  initEvents(gameRound)
  sound.initMusicAndButton()
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

  const allButtonEls = [ boardBtn, startBtn]
  console.log(allButtonEls)

  allButtonEls.forEach((buttonEl) => {
    buttonEl.addEventListener('mouseenter', () => {
      sound.playHover()
    })
  })
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
  console.log(`position as string is: ${indexString}`)
  const pos = Number(indexString)
  console.log(`position as number is: ${pos}`)

  console.log(`Position from player click is: ${pos}`)
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
      Array.from(aiGridEl.children).forEach((aiCell) => { aiCell.classList.remove('can-aim') })

      let winner = gameRound.checkIfWin()
      render.showGameOver(winner)
      sound.playEnd(winner)
      
    }
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
    render.startFireAnimation(aiGridEl, pos)
    render.markHitAndRenderShipAnimation(aiGridEl, pos, aiShipInFleet, gameRound)
  } else { //on miss for player
    sound.playNegative()
    render.splashAnimation(aiGridEl, pos)
    setTimeout(() => { render.markMissedShotAnimation(aiGridEl, pos) }, 1000)
    
  }

  setTimeout(() => {

    if (playerShipInFleet) { //ai on hit
      render.startFireAnimation(playerGridEl, aiHitPos)
    } else { //ai on miss
      render.splashAnimation(playerGridEl, aiHitPos)

      setTimeout(() => { render.markMissedShotAnimation(playerGridEl, aiHitPos) }, 1000)
      
    }
  }, 1000)
}

function resetGame(gameRound) {
  render.clearDisplay(playerGridEl, aiGridEl)
  gameRound.playAgain()
  render.renderFleet(playerGridEl, gameRound.boards.player)

}