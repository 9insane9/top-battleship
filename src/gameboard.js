const { hasSubsequence } = require('extra-array')
const Ship = require('./ship')

const Gameboard = function() {
  const boardState = []
  const shotsReceived = []

  const fleet = {
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

  initializeBoard()

  //a
  function placeShip(shipID, coordinate, axis) {
    const shipLength = fleet[shipID].status.length
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
      } else if (axis === "x"){
        for (let i = 0; i < shipLength; i++) {
          boardState[coordinate] = `${shipID}`
          coordinate++;
        }
      }

      fleet[shipID].status.position = shipCoordinates
      fleet[shipID].status.axis = axis
      console.log(`${shipID} placed at ${shipCoordinates}, orientation: ${axis}`)

    } catch (error) {
      throw new Error(`Invalid placement: ${error.message}`)
    }
  }

  function receiveAttack(pos) {
    shotsReceived.push(pos)

    if (boardState[pos] !== '') {
      console.log(`Board: Attack successfully received at ${pos}`)
      return fleet[boardState[pos]].hit()
    }
  }

  function allShipsSunk() {
    return Object.values(this.fleet).every(ship => ship.status.isSunk)
  }

  function countShipsLeft() {
    const shipsLeft = {
      ships1: 0,
      ships2: 0,
      ships3: 0,
      ships4: 0,
    }

    Object.values(this.fleet).forEach(ship => {
      const length = ship.status.length
      const isSunk = ship.status.isSunk

      if (!isSunk) {

        if (length === 1) shipsLeft.ships1++
        else if (length === 2) shipsLeft.ships2++
        else if (length === 3) shipsLeft.ships3++
        else if (length === 4) shipsLeft.ships4++
    }
    })

    return shipsLeft
  }

  function initializeBoard() {
    fleet.destroyer1 = new Ship(1)
    fleet.destroyer2 = new Ship(1)
    fleet.destroyer3 = new Ship(1)
    fleet.destroyer4 = new Ship(1)
    fleet.submarine1 = new Ship(2)
    fleet.submarine2 = new Ship(2)
    fleet.submarine3 = new Ship(2)
    fleet.battleship1 = new Ship(3)
    fleet.battleship2 = new Ship(3)
    fleet.cruiser1 = new Ship(4)

    shotsReceived.length = 0 //reset received shots 
    boardState.length = 0  //init empty boardState
    for (let i = 0; i < 100; i++) { boardState.push('') }

  }

  function getAllStillOpenShipPositions() {
    const allShipPositions = []
  
    Object.values(this.fleet).forEach(ship => {
      const validPositions = ship.status.position.filter(position => 
        !this.shotsReceived.includes(position)
      )
      allShipPositions.push(...validPositions)
    })

    console.log(`Valid positions for cheating: ${allShipPositions}`)
    return allShipPositions
  }

  return { boardState, 
          shotsReceived, 
          fleet, 
          placeShip, 
          initializeBoard, 
          receiveAttack,
          countShipsLeft, 
          allShipsSunk,
          getAllStillOpenShipPositions }
}

const placement = (function() {
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

  //e
  function checkAdjacent(boardState, shipCoordinates) {
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