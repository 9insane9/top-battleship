import destroyer from './images/destroyer.png'
import shipEnd from './images/shipEnd.png'
import shipMiddle from './images/shipMiddle.png'
import wave1 from './images/waveFrame1.png'
import wave2 from './images/waveFrame2.png'

import flame1 from './images/flame1.png'
import flame2 from './images/flame2.png'
import flame3 from './images/flame3.png'
import mark1 from './images/finalMark1.png'
import mark2 from './images/finalMark2.png'
import miss1 from './images/finalCross1.png'
import miss2 from './images/finalCross2.png'
import splash1 from './images/splash1.png'
import splash2 from './images/splash2.png'
import splash3 from './images/splash3.png'

import playerIndicator1 from './images/indicators/pi1.png'
import playerIndicator2 from './images/indicators/pi2.png'
import playerIndicator3 from './images/indicators/pi3.png'
import playerIndicator4 from './images/indicators/pi4.png'
import aiIndicator1 from './images/indicators/aii1.png'
import aiIndicator2 from './images/indicators/aii2.png'
import aiIndicator3 from './images/indicators/aii3.png'
import aiIndicator4 from './images/indicators/aii4.png'

 export const display = function() {

  const fireFrames = [flame1, flame2, flame3]
  const hitFrames = [mark1, mark2]
  const missFrames = [miss1, miss2]
  const splashFrames = [splash1, splash2, splash3]

  function generateGrids() {
    const playerGridContainer = document.querySelector(".player-grid")
    const aiGridContainer = document.querySelector(".ai-grid")

    for (let i = 0; i < 100; i++) {
      const divPlayer = document.createElement("div")
      divPlayer.classList.add("cell")
      divPlayer.classList.add("player-cell")
      divPlayer.setAttribute("data-index", i)
      playerGridContainer.appendChild(divPlayer)

      const divAi = document.createElement("div")
      divAi.classList.add("cell")
      divAi.classList.add("ai-cell")
      divAi.setAttribute("data-index", i)
      aiGridContainer.appendChild(divAi)
    }
    console.log('Grids created!')
  }

  function generateIndicators() {
    const playerShipInfoEl = document.querySelector('.player-ship-info')
    const aiShipInfoEl = document.querySelector('.ai-ship-info')

    const playerIndicators = {
      playerShip1: createImage(playerIndicator1),
      playerShip2: createImage(playerIndicator2),
      playerShip3: createImage(playerIndicator3),
      playerShip4: createImage(playerIndicator4)
    }

    const aiIndicators = {
      aiShip1: createImage(aiIndicator1),
      aiShip2: createImage(aiIndicator2),
      aiShip3: createImage(aiIndicator3),
      aiShip4: createImage(aiIndicator4)
    }

    function addIndicators(indicators, container, baseClassName) {
      Object.entries(indicators).forEach(([key, image], index, array) => {
        image.className = "ship-icon"
        container.appendChild(image);

        image.style.height = '100%';
        image.style.width = '100%';
        image.style.objectFit = 'cover';

        const textClassName = `ship-text ${baseClassName}-ships${index + 1}`
        const textElement = createTextElement(key, textClassName)
        container.appendChild(textElement)

        // append a spacer if not last element
        if (index < array.length - 1) {
          const spacer = createSpacer()
          spacer.className = "ship-spacer"
          container.appendChild(spacer)
        }
      })
    }

    function createTextElement(text, className) {
      const p = document.createElement('p');
      p.textContent = 0;
      p.className = className;
      return p;
    }

    function createSpacer() {
      const p = document.createElement('p');
      p.textContent = '|';
      p.className = 'spacer';
      return p;
    }

    addIndicators(playerIndicators, playerShipInfoEl, 'player');
    addIndicators(aiIndicators, aiShipInfoEl, 'ai');
  }

  function renderShip(gridEl, coordinates, ship) {
    console.log(`Rendering ship at ${coordinates}!`)
    const length = ship.status.length

    coordinates.forEach((coord, index) => {
      const allCells = Array.from(gridEl.children)
              .filter(child => child.classList.contains('cell'))

      const cell = allCells[coord]

      const shipMarkElement = cell.querySelector(".ship-mark")
      if (shipMarkElement) { shipMarkElement.remove() }

      if (length === 1) {
        cell.appendChild(createImage(destroyer, ship.status.axis))
      } else {

        if (index === 0) { //start
          cell.appendChild(createImage(shipEnd, ship.status.axis, true, false))
        } else if (index === coordinates.length - 1) { //end
          cell.appendChild(createImage(shipEnd, ship.status.axis, false, true))
        } else { //middle
          cell.appendChild(createImage(shipMiddle, ship.status.axis))
        }
      }
    })
  }

  function renderFleet(gridEl, board) {

    const allCells = Array.from(gridEl.children)
              .filter(child => child.classList.contains('cell'))

    allCells.forEach(cell => {
      cell.innerHTML = ''
    })

    Object.keys(board.fleet).forEach(shipID => {
      const ship = board.fleet[shipID]
      const coordinates = ship.status.position

      if (coordinates && coordinates.length > 0) {
        renderShip(gridEl, coordinates, ship)
      }
    })
  }

  function clearDisplay(...gridEls) {
    gridEls.forEach(gridEl => {
      const imgElements = Array.from(gridEl.querySelectorAll('img'))
        .filter(img => !img.classList.contains('ship-icon'))
  
      imgElements.forEach(img => img.remove())
    })
  }

  function updateIndicators(gameRound) {

    const playerIndicatorStates = {
      ships1: document.querySelector(".player-ships1"),
      ships2: document.querySelector(".player-ships2"),
      ships3: document.querySelector(".player-ships3"),
      ships4: document.querySelector(".player-ships4")
    }
    
    const aiIndicatorStates = {
      ships1: document.querySelector(".ai-ships1"),
      ships2: document.querySelector(".ai-ships2"),
      ships3: document.querySelector(".ai-ships3"),
      ships4: document.querySelector(".ai-ships4")
    }

    const playerShipsLeft = gameRound.boards.player.countShipsLeft()
    const aiShipsLeft = gameRound.boards.ai.countShipsLeft()

    playerIndicatorStates.ships1.textContent = playerShipsLeft.ships1;
    playerIndicatorStates.ships2.textContent = playerShipsLeft.ships2;
    playerIndicatorStates.ships3.textContent = playerShipsLeft.ships3;
    playerIndicatorStates.ships4.textContent = playerShipsLeft.ships4;

    // Update AI indicators
    aiIndicatorStates.ships1.textContent = aiShipsLeft.ships1;
    aiIndicatorStates.ships2.textContent = aiShipsLeft.ships2;
    aiIndicatorStates.ships3.textContent = aiShipsLeft.ships3;
    aiIndicatorStates.ships4.textContent = aiShipsLeft.ships4;

    console.log("Indicators updated!")
  }

  //animations
  function startWaterAnimation(grid1, grid2) {
    generateWater(grid1, grid2)
    setInterval(() => {
      swapFrame(grid1, grid2)
    }, 1000)
  }

  function generateWater(...grids) {

    grids.forEach((grid) => {
      const children = Array.from(grid.children)
              .filter(child => child.classList.contains('cell'))

      children.forEach((child, index) => {
        const rowIndex = Math.floor(index / 10)

        if (rowIndex % 2 === 0) { //even rows
          child.style.backgroundImage = `url('${wave1}')`
        } else { // odd rows
          child.style.backgroundImage = `url('${wave2}')`
        }

        child.style.overflow = "hidden"
        child.style.backgroundSize = "cover"
        child.style.backgroundRepeat = "no-repeat"
      })
    })
  }

  //
  function startFireAnimation(gridEl, pos) {
    const cells = Array.from(gridEl.children)

    cells.forEach((cell) => {
      if (cell.getAttribute("data-index") == pos) {
        startAnimation(cell, fireFrames, true, 500, "fire")
      }
    })
  }

  function markHitAndRenderShipAnimation(gridEl, pos, ship, gameRound) {
    const cells = Array.from(gridEl.children)

    cells.forEach((cell) => {
      if (cell.getAttribute("data-index") == pos) {
        startAnimation(cell, hitFrames, true, 500, "ship-mark", "5")
        if (ship.status.isSunk) {

          const board = gameRound.boards.ai
          const shipID = board.boardState[pos]
          const coordinates = board.fleet[shipID].status.position

          renderShip(gridEl, coordinates, ship)
        }
      }
    })
  }

  function markMissedShotAnimation(gridEl, pos) {
    const cells = Array.from(gridEl.children)

    cells.forEach((cell) => {
      if (cell.getAttribute("data-index") == pos) {
        startAnimation(cell, missFrames, true, 500, "missed") //replace with missedFrames
      }
    })
  }

  function splashAnimation(gridEl, pos) {
    const cells = Array.from(gridEl.children)

    cells.forEach((cell) => {
      if (cell.getAttribute("data-index") == pos) {
        startAnimation(cell, splashFrames, false, 250)
      }
    })
  }

  //animation helpers

  //water
  let isFirstWaterFrame = true

  function swapFrame(...grids) {
    grids.forEach((grid) => {
      const children = Array.from(grid.children)
              .filter(child => child.classList.contains('cell'))
              
      children.forEach((child, index) => {
        const rowIndex = Math.floor(index / 10)

        //re-align based on state
        if (rowIndex % 2 === 0) {
          child.style.background = isFirstWaterFrame
            ? `url('${wave2}')`
            : `url('${wave1}')`
        } else {
          child.style.background = isFirstWaterFrame
            ? `url('${wave1}')`
            : `url('${wave2}')`
        }

        child.style.overflow = "hidden"
        child.style.backgroundSize = "cover"
        child.style.backgroundRepeat = "no-repeat"
      })
    })

    isFirstWaterFrame = !isFirstWaterFrame
  }

  function startAnimation(parentEl, framesArr, isLoop, interval, className = "no-class", zIndex = '6') {
    const imgEl = document.createElement("img")
    imgEl.style.pointerEvents = "none"

    imgEl.classList.add(className)

    parentEl.appendChild(imgEl)

    if (isLoop) {
      let currentFrame = 0
      let direction = 1

      setInterval(() => {
        currentFrame += direction

        if (currentFrame === framesArr.length - 1 || currentFrame === 0) {
            direction *= -1
        }

        imgEl.src = framesArr[currentFrame]
        imgEl.style.width = '100%'
        imgEl.style.height = '100%'
        imgEl.style.zIndex = zIndex
        imgEl.style.position = 'absolute'
      }, interval)

    } else { //one time animation
      let currentFrame = 0

      const intervalId = setInterval(() => {
        if (currentFrame < framesArr.length) {
            imgEl.src = framesArr[currentFrame]
            imgEl.style.width = '100%'
            imgEl.style.height = '100%'
            imgEl.style.zIndex = '6'
            imgEl.style.position = 'absolute'
            currentFrame++
        } else {
            clearInterval(intervalId)
            imgEl.remove()
        }
      }, interval)
    }
  }

  //game-start-end
  function showGameStart() {
    const gameStartTextEl = document.querySelector('.game-start-text')

    gameStartTextEl.classList.remove("invisible")
    setTimeout(() => { 
      gameStartTextEl.classList.add("invisible")
    }, 2500);
  }

  function showGameOver(winner) {
    const gameOverEl = document.querySelector('.game-over')
    const gameOverTextEl = document.querySelector('.game-over-text')

    gameOverEl.classList.remove('invisible')
    
    if (winner === "ai") { 
      gameOverTextEl.style.color = "red"
      gameOverTextEl.textContent = "You have lost!"
     }
    
    if (winner === "player") { 
      gameOverTextEl.style.color = "rgb(0, 255, 85)"
      gameOverTextEl.textContent = "You have won!" 
    }
  }

  //big shout
  function createImage(src, axis = null, isStart = false, isLast = false) {
    const img = document.createElement('img')
    img.style.pointerEvents = "none"
    img.src = src
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.zIndex = '5'
    
    if (axis) {
      if (axis === 'x') {
        img.style.transform = isLast ? 'rotate(90deg) scaleX(-1)' : 'rotate(90deg)'
        img.style.transformOrigin = 'center'
        if (isStart) {
          img.style.transform = 'rotate(-90deg) scaleX(-1)'
        }
      } else if (axis === 'y') {
        img.style.transform = isLast ? 'scaleY(-1)' : ''
        img.style.transformOrigin = 'center'
      }
    }
    return img
  }

  return {
    generateGrids,
    generateIndicators,
    updateIndicators,
    startWaterAnimation,
    renderFleet,
    startFireAnimation,
    splashAnimation, 
    markHitAndRenderShipAnimation, 
    markMissedShotAnimation,
    showGameStart,
    showGameOver,
    clearDisplay
  }
 }