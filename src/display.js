import destroyer from './images/destroyer.png'
import shipEnd from './images/shipEnd.png'
import shipMiddle from './images/shipMiddle.png'
import wave from './images/wave.png'
 
 export const display = function() {

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

  function startWaterEffect(grid1, grid2) {
    generateWater(grid1, grid2)
    setInterval(() => {
      swapAlignment(grid1, grid2)
    }, 1500)
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
        child.style.backgroundColor = 'rgb(89, 89, 255, 0.5)'
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
        child.style.backgroundColor = 'rgb(89, 89, 255, 0.8)' //fill gaps in background
      })
    })

    isLeftAligned = !isLeftAligned
  }  

  function renderShips(gridEl, board) {

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
  
    function renderShip(shipID, coordinates) {
      const length = board.fleet[shipID].status.length
  
      coordinates.forEach((coord, index) => {
        const cell = gridEl.children[coord]

        if (length === 1) {
          cell.appendChild(createImage(destroyer, board.fleet[shipID].status.axis))
        } else {
  
          if (index === 0) { //start
            cell.appendChild(createImage(shipEnd, board.fleet[shipID].status.axis, true, false))
          } else if (index === coordinates.length - 1) { //end
            cell.appendChild(createImage(shipEnd, board.fleet[shipID].status.axis, false, true))
          } else { //middle
            cell.appendChild(createImage(shipMiddle, board.fleet[shipID].status.axis))
          }
      }
      })
    }

    Array.from(gridEl.children).forEach(child => {
      child.innerHTML = ''
    })
  
    ///render
    Object.keys(board.fleet).forEach(shipID => {
      const ship = board.fleet[shipID]
      const coordinates = ship.status.position
      if (coordinates && coordinates.length > 0) {
        renderShip(shipID, coordinates)
      }
    })
  }

  return {
    generateGrids,
    startWaterEffect,
    renderShips
  }
 }
