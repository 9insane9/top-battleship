import destroyer from './images/destroyer1.png'
import shipEnd from './images/shipEnd1.png'
import shipMiddle from './images/shipMiddle1.png'
import wave from './images/wave1.png'

import flame1 from './images/flame1.png'
import flame2 from './images/flame2.png'
import flame3 from './images/flame3.png'
import hit1 from './images/markHit1.png'
import hit2 from './images/markHit2.png'
import miss1 from './images/markMiss1.png'
import miss2 from './images/markMiss2.png'
import miss3 from './images/markMiss3.png'
import miss4 from './images/markMiss4.png'
import splash1 from './images/hitSplash1.png'
import splash2 from './images/hitSplash2.png'
import splash3 from './images/hitSplash3.png'

 export const display = function() {

  const fireFrames = [flame1, flame2, flame3]
  const hitFrames = [hit1, hit2]
  const missFrames = [miss1, miss2, miss3, miss4]
  const splashFrames = [splash1, splash2, splash3]

  function generateGrids() {
    const playerGridContainer = document.querySelector(".player-grid")
    const aiGridContainer = document.querySelector(".ai-grid")

    for (let i = 0; i < 100; i++) {
      const divPlayer = document.createElement("div")
      divPlayer.classList.add("player-cell")
      divPlayer.setAttribute("data-index", i)
      playerGridContainer.appendChild(divPlayer)

      const divAi = document.createElement("div")
      divAi.classList.add("ai-cell")
      divAi.setAttribute("data-index", i)
      aiGridContainer.appendChild(divAi)
    }
    console.log('Grids created!')
  }

  function startWaterAnimation(grid1, grid2) {
    generateWater(grid1, grid2)
    setInterval(() => {
      swapAlignment(grid1, grid2)
    }, 1000)
  }

  function generateWater(...grids) {

    grids.forEach((grid) => {
      const children = Array.from(grid.children)

      children.forEach((child, index) => {
        const rowIndex = Math.floor(index / 10)

        if (rowIndex % 2 === 0) { //even rows
          child.style.backgroundImage = `url('${wave}') no-repeat left center`
        } else { // odd rows
          child.style.backgroundImage = `url('${wave}') no-repeat right center`
        }

        child.style.backgroundSize = "contain"
        child.style.backgroundRepeat = "no-repeat"
      })
    })
  }

  let isLeftAligned = true //track alignment

  function swapAlignment(...grids) {
    grids.forEach((grid) => {
      const children = Array.from(grid.children)

      children.forEach((child, index) => {
        const rowIndex = Math.floor(index / 10)

        // re-align based on state
        if (rowIndex % 2 === 0) {
          child.style.background = isLeftAligned
            ? `url('${wave}') no-repeat left center`
            : `url('${wave}') no-repeat right center`
        } else {
          child.style.background = isLeftAligned
            ? `url('${wave}') no-repeat right center`
            : `url('${wave}') no-repeat left center`
        }

        child.style.backgroundSize = "cover"
        child.style.backgroundRepeat = "no-repeat"
        // child.style.backgroundColor = 'rgb(89, 89, 255, 0.8)' //fill gaps in background
      })
    })

    isLeftAligned = !isLeftAligned
  }  


  function createImage(src, axis, isStart = false, isLast = false) {
    const img = document.createElement('img')
    img.style.zIndex = "5"
    img.src = src
    img.style.width = '100%'
    img.style.height = '100%'
    img.style.zIndex = '5'
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
    return img
  }

  function renderShip(gridEl, coordinates, ship) {
    const length = ship.status.length

    coordinates.forEach((coord, index) => {
      const cell = gridEl.children[coord]

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

    Array.from(gridEl.children).forEach(child => {
      child.innerHTML = ''
    })

    Object.keys(board.fleet).forEach(shipID => {
      const ship = board.fleet[shipID]
      const coordinates = ship.status.position
      console.log(coordinates)
      if (coordinates && coordinates.length > 0) {
        renderShip(gridEl, coordinates, ship)
      }
    })
  }

  //fleet helpers

  

  //animations

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
        startAnimation(cell, splashFrames, false, 500) //replace with splashFrames
      }
    })
  }



  function startAnimation(parentEl, framesArr, isLoop, interval, className = "no-class", zIndex = '6') {
    const imgEl = document.createElement("img")

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

  return {
    generateGrids,
    startWaterAnimation,
    renderFleet,
    startFireAnimation,
    splashAnimation, 
    markHitAndRenderShipAnimation, 
    markMissedShotAnimation
  }
 }
