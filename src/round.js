const Gameboard = require('../src/gameboard')

const round = function (randomLayoutFn = genRandomLayout) {
  const player1board = new Gameboard()
  randomLayoutFn(player1board)
  
  return {
    player1board: player1board,
  }
}

function genRandomLayout(playerBoard, randomPlacementFn = genRandomPlacement) {
  const shipYard = playerBoard.shipYard

  Object.keys(shipYard).forEach((key) => {
    let placed = false

    while (!placed) {
      try {
        const placement = randomPlacementFn()
        const position = placement.position
        const orientation = placement.orientation
        playerBoard.placeShip(key, position, orientation)
        placed = true
      }
      catch (error) {
        // throw new Error(`${error.message}`)
      }
    }
  })
}

function genRandomPlacement() {
  const position = Math.floor(Math.random() * 100)
  const orientation = Math.random() < 0.5 ? "x" : "y"

  return {
    position,
    orientation,
  }
}

module.exports = { round, genRandomLayout }

