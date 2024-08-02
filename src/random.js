function genRandomLayout(playerBoard, randomPlacementFn = genRandomPlacement) {
  const shipYard = playerBoard.fleet

  Object.keys(shipYard).forEach((key) => {
    let placed = false

    while (!placed) {
      try {
        const placement = randomPlacementFn()
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

function genRandomPlacement() {
  const position = Math.floor(Math.random() * 100)
  const orientation = Math.random() < 0.5 ? "x" : "y"

  return {
    position: position,
    orientation: orientation,
  }
}

module.exports = genRandomLayout 

