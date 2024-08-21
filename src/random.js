//default layout

const defaultLayout = function(playerBoard) {
  
  function defaultPlacement(values) {
    this.values = values
    this.index = 0
  }

  defaultPlacement.prototype.nextValue = function() {
    if (this.index < this.values.length) {
      const current = this.values[this.index++]
      return current
    } else {
      throw new Error("No more custom random values available")
    }
  }

  const placements = new defaultPlacement([
    {position: 0, orientation: "y"},  //1
    {position: 12, orientation: "x"},  //1
    {position: 46, orientation: "y"},  //1
    {position: 93, orientation: "x"},  //1
    {position: 17, orientation: "x"}, //2
    {position: 41, orientation: "x"}, //2
    {position: 75, orientation: "x"}, //2
    {position: 4, orientation: "y"}, //3
    {position: 38, orientation: "y"}, //3
    {position: 60, orientation: "y"}, //4
    ])

  const boundNextValue = placements.nextValue.bind(placements)

  const player1randomBoard = genRandomLayout(playerBoard, boundNextValue)
  return player1randomBoard
}

function genRandomLayout(playerBoard, randomPlacementFn = genRandomPlacement, maxAttempts = 300, retryAttempts = 2) {
  const fleet = playerBoard.fleet
  let totalAttempts = 0

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
          console.log('Falling back to default layout...')
          playerBoard.initializeBoard()
          playerBoard = defaultLayout(playerBoard)
          // throw error
        }
      }
    }
  }

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
        console.error('Max total attempts reached.')
        throw new Error('Failed to place all ships after maximum attempts.')
      }
    }

    if (!placed) {
      throw new Error(`Failed to place ship ${shipID} after ${maxAttempts} attempts.`)
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
