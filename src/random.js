function genRandomLayout(playerBoard, randomPlacementFn = genRandomPlacement) {
  const fleet = playerBoard.fleet

  Object.keys(fleet).forEach((key) => {
    let placed = false

    while (!placed) {
      try {
        const placement = randomPlacementFn(playerBoard)
        playerBoard.placeShip(key, placement.position, placement.orientation)
        placed = true
      }
      catch (error) {
        console.error(`Error placing ship for key ${key}: ${error.message}`)
      }
    }
  })

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

