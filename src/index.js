import './style.css'
import { display } from './display.js'

// const display = require('../src/display')
const round = require('../src/round')

const render = display()
const gameRound = round()

render.generateGrids()

const playerGridEl = document.querySelector('.player-grid')
const aiGridEl = document.querySelector('.ai-grid')

render.startWaterEffect(playerGridEl, aiGridEl) //startWaterEffect
render.renderShips(playerGridEl, gameRound.boards.player)

document.addEventListener("DOMContentLoaded", () => {
  initEvents(gameRound)
  render.renderShips(gameRound.boards.player.boardState)
})

function initEvents(gameRound) {
  const boardBtn = document.querySelector('.generate-board-btn')
  const startBtn = document.querySelector('.start-game-btn')

  boardBtn.addEventListener('click', () => {
    gameRound.menu().generateRandomBoard(gameRound.boards.player)
    render.renderShips(playerGridEl, gameRound.boards.player)
  })

  startBtn.addEventListener('click', () => {
    start()
  })
}

function start() {
  aiGridEl.addEventListener('click', fireShotEvent)
  gameRound.menu().startGame()
}

function fireShotEvent(event) {
  console.log('Firing shot!')
  const pos = event.target.getAttribute('data-index');
  gameRound.playTurn(pos)

  let gameOver = gameRound.getGameOver()
  if (gameOver) {
    aiGridEl.removeEventListener('click', fireShotEvent)
  }
}

