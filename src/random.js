// function genRandomLayout(playerBoard, randomPlacementFn = genRandomPlacement) {
//   const fleet = playerBoard.fleet

//   Object.keys(fleet).forEach((key) => {
//     let placed = false

//     while (!placed) {
//       try {
//         const placement = randomPlacementFn(playerBoard)
//         playerBoard.placeShip(key, placement.position, placement.orientation)
//         placed = true
//       }
//       catch (error) {
//         console.error(`Error placing ship for key ${key}: ${error.message}`)
//       }
//     }
//   })

//   return playerBoard
// }

// function genRandomPlacement(playerBoard) {
//   let position 

//   do {
//     position = Math.floor(Math.random() * 100)
//   } while (playerBoard.boardState[position] !== "")
//   const orientation = Math.random() < 0.5 ? "x" : "y"

//   return {
//     position: position,
//     orientation: orientation,
//   }
// }



// module.exports = genRandomLayout 

function genRandomLayout(playerBoard, randomPlacementFn = genRandomPlacement, maxAttempts = 1000, retryAttempts = 3) {
  const fleet = playerBoard.fleet
  let totalAttempts = 0

  function tryPlaceShip(shipID) {
    let placed = false
    let attempts = 0

    while (!placed && attempts < maxAttempts) {
      try {
        const placement = randomPlacementFn(playerBoard)
        playerBoard.placeShip(shipID, placement.position, placement.orientation)
        placed = true
      } catch (error) {
        attempts++
        console.error(`Error placing ship ${shipID}: ${error.message}. Attempt ${attempts}/${maxAttempts}`)
      }

      totalAttempts++
      if (totalAttempts >= maxAttempts * Object.keys(fleet).length) {
        console.error('Max total attempts reached. Retry or handle the failure.')
        throw new Error('Failed to place all ships after maximum attempts.')
      }
    }

    if (!placed) {
      throw new Error(`Failed to place ship ${shipID} after ${maxAttempts} attempts.`)
    }
  }

  for (const shipID of Object.keys(fleet)) {
    let attempts = 0
    while (attempts < retryAttempts) {
      try {
        tryPlaceShip(shipID)
        break // break out of retry loop if successful
      } catch (error) {
        attempts++
        console.warn(`Retry ${attempts}/${retryAttempts} for ship ${shipID}. Error: ${error.message}`)
        if (attempts >= retryAttempts) {
          console.error(`Failed to place ship ${shipID} after ${retryAttempts} retries.`)
          throw error
        }
      }
    }
  }

  return playerBoard
}

function genRandomPlacement(playerBoard) {
  let position
  do {
    position = Math.floor(Math.random() * 100)
  } while (playerBoard.boardState[position] !== "")
  const orientation = Math.random() < 0.5 ? "x" : "y"
  
  return {
    position: position,
    orientation: orientation,
  }
}

module.exports = genRandomLayout
