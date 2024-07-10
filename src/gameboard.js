const Ship = require('../src/ship')

const Gameboard = function() {
  const boardState = []
  initializeBoard()

  function placeShip(shipID, coordinate) {
    const shipLength = shipYard[shipID].ship.length;
    
    try {
      checkOverlap(shipLength, coordinate)
  
      for (let i = 0; i < shipLength; i++) {
        boardState[coordinate] = `${shipID}`
        coordinate++;
      }
    } catch (error) {
      throw new Error(`Invalid placement: ${error.message}`)
    }
  }

  function checkOverlap(shipLength, coordinate) {
    for (let i = 0; i < shipLength; i++) {
      if (boardState[coordinate] !== '') {
        throw new Error('Ships cannot overlap!')
      }
      coordinate++
    }
  }

  function initializeBoard() {
    for (let i = 0; i < 100; i++) { boardState.push('') }
  }

  return { boardState, placeShip }
}

const shipYard = {
  destroyer1: new Ship(1),
  destroyer2: new Ship(1),
  destroyer3: new Ship(1),
  destroyer4: new Ship(1),
  submarine1: new Ship(2),
  submarine2: new Ship(2),
  submarine3: new Ship(2),
  battleship1: new Ship(3),
  battleship2: new Ship(3),
  cruiser1: new Ship(4),
}

module.exports = Gameboard