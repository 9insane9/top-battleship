const { hasSubsequence } = require('extra-array')

const Ship = require('../src/ship')

const Gameboard = function() {
  const boardState = []
  initializeBoard()

  //a
  function placeShip(shipID, coordinate, axis) {
    const shipLength = shipYard[shipID].ship.length
    const shipCoordinates = []

    if (axis === "y") {
      for (let i = 0; i < shipLength; i++) {
        shipCoordinates.push(coordinate + i * 10)
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        shipCoordinates.push(coordinate + i)
      }
    }
    
    try {
      placement.checkBounds(shipCoordinates, axis)
      placement.checkDuplicate(boardState, shipID)
      placement.checkOverlap(boardState, shipLength, coordinate, axis)
      placement.checkAdjacent(boardState, shipCoordinates)
      
      if (axis === "y") {
        for (let i = 0; i < shipLength; i++) {
          boardState[coordinate] = `${shipID}`
          coordinate = coordinate + 10
        }        
      } else {
        for (let i = 0; i < shipLength; i++) {
          boardState[coordinate] = `${shipID}`
          coordinate++;
        }
      }
    } catch (error) {
      throw new Error(`Invalid placement: ${error.message}`)
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

const placement = (function(boardState) {
  const rows = []
  const columns = []
  
  initializeRowsColumns()

  //b
  function checkOverlap(boardState, shipLength, coordinate, axis) {
    if (axis === "y") {
      for (let i = 0; i < shipLength; i++) {
        if (boardState[coordinate + i * 10] !== '') {
          throw new Error('Ships cannot overlap! (V)')
        }
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        if (boardState[coordinate + i] !== '') {
          throw new Error('Ships cannot overlap! (H)')
        }
      }
    }
  }

  //c
  function checkDuplicate(boardState, shipID) {
    if (boardState.includes(`${shipID}`)) {
      throw new Error('Ship already on board!')
    }
  }

  //d
  function checkBounds(shipCoordinates, axis) {
    if (axis === "y") {
      for (let i = 0; i < columns.length; i++) {
        if (hasSubsequence(columns[i], shipCoordinates)) {
          return
        }
      }
      throw new Error('Out of bounds! (V)')
    } else {
      for (let i = 0; i < rows.length; i++) {
        if (hasSubsequence(rows[i], shipCoordinates)) {
          return
        }
      }
      throw new Error('Out of bounds! (H)')
    }
  }

  
  function checkAdjacent(boardState, shipCoordinates) {
    //e
    const adjacentCoordinates = []

    shipCoordinates.forEach((coordinate) => {
      let allCoordinates = []

      allCoordinates.push(coordinate - 11)
      allCoordinates.push(coordinate - 10)
      allCoordinates.push(coordinate - 9)
      allCoordinates.push(coordinate - 1)
      allCoordinates.push(coordinate + 1)
      allCoordinates.push(coordinate + 9)
      allCoordinates.push(coordinate + 10)
      allCoordinates.push(coordinate + 11)

      allCoordinates.forEach((newCoordinate) => {
        if (!adjacentCoordinates.includes(newCoordinate)
        && newCoordinate >= 0
        && newCoordinate <= 99) {
          adjacentCoordinates.push(newCoordinate)
        }
      })      
    })

    adjacentCoordinates.forEach((coordinate) => {
      if (boardState[coordinate] !== "") {
        throw new Error('Must leave space!')
      }
    })

  }

  function initializeRowsColumns() {
    for (let i = 0; i < 10; i++) {
      const row = []

      for (let j = 0; j < 10; j++) {
        row.push(i * 10 + j)
      }
      rows.push(row)
    }

    for (let i = 0; i < 10; i++) {
      columns.push([])
    }

    for (let index = 0; index < 100; index++) {
      const lastDigit = index % 10
      columns[lastDigit].push(index)
    }
  }

  return {
    checkDuplicate, 
    checkOverlap,
    checkBounds,
    checkAdjacent,
    rows,
    columns,
  }
}())

module.exports = Gameboard