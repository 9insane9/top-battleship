import destroyer from './images/destroyer.png'
import shipEnd from './images/shipEnd.png'
import shipMiddle from './images/shipMiddle.png'
 
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

  function renderShips(gridEl, board) {

    function createImage(src, axis, isStart = false, isLast = false) {
      const img = document.createElement('img')
      img.src = src
      img.style.width = '100%'
      img.style.height = '100%'
      if (axis === 'x') {
        img.style.transform = isLast ? 'rotate(90deg) scaleX(-1)' : 'rotate(90deg)';
        img.style.transformOrigin = 'center'; // Rotate around the center of the image
        if (isStart) {
          img.style.transform = 'rotate(-90deg) scaleX(-1)';
        }
      } else if (axis === 'y') {
        img.style.transform = isLast ? 'scaleY(-1)' : '';
        img.style.transformOrigin = 'center'; // Rotate around the center of the image
      }
      return img;
    }
  
    // Function to render a ship
    function renderShip(shipID, coordinates) {
      const length = board.fleet[shipID].status.length;
  
      coordinates.forEach((coord, index) => {
        const cell = gridEl.children[coord]

        if (length === 1) {
          cell.appendChild(createImage(destroyer, board.fleet[shipID].status.axis))
        } else {
  
          if (index === 0) {
            // Place start image
            cell.appendChild(createImage(shipEnd, board.fleet[shipID].status.axis, true, false))
          } else if (index === coordinates.length - 1) {
            // Place end image
            cell.appendChild(createImage(shipEnd, board.fleet[shipID].status.axis, false, true))
          } else {
            // Place middle image
            cell.appendChild(createImage(shipMiddle, board.fleet[shipID].status.axis))
          }
      }
      })
    }
  
    // Clear existing images
    Array.from(gridEl.children).forEach(child => {
      child.innerHTML = ''; // Remove all child nodes
    });
  
    // Render ships
    Object.keys(board.fleet).forEach(shipID => {
      const ship = board.fleet[shipID];
      const coordinates = ship.status.position;
      if (coordinates && coordinates.length > 0) {
        renderShip(shipID, coordinates);
      }
    })
  }

  return {
    generateGrids,
    renderShips
  }
 }
