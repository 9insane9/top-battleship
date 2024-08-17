const Gameboard = require('../src/gameboard')

//a
it('place specific ship starting from coordinate', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5, "x")

  expect(board.boardState[5]).toBe("battleship1")
  expect(board.boardState[6]).toBe("battleship1")
  expect(board.boardState[7]).toBe("battleship1")  
})

//b
it('cannot place overlapping ships', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5, "x")
  
  expect(() => board.placeShip('battleship2', 4)).toThrow('Invalid placement: Ships cannot overlap! (H)')
})

//c
it('cannot place duplicate ship', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5, "x")

  expect(() => board.placeShip('battleship1', 12, "x")).toThrow('Invalid placement: Ship already on board!')
})

//d
it('cannot place ship out of bounds', () => {
  const board = new Gameboard()
  
  expect(() => board.placeShip('battleship1', 87, "y")).toThrow('Invalid placement: Out of bounds! (V)')
  expect(() => board.placeShip('battleship2', 99, "x")).toThrow('Invalid placement: Out of bounds! (H)')
})

//e
it('must leave space between ships', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 0, "x")
  
  expect(() => board.placeShip('battleship2', 3, "x")).toThrow('Invalid placement: Must leave space!')
  expect(() => board.placeShip('cruiser1', 13, "y")).toThrow('Invalid placement: Must leave space!')

})

it('ship status has correct position', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 0, "x")

  expect(board.fleet['battleship1'].status.position).toStrictEqual([0, 1, 2])
})

it('board can receive attack', () => {
  const board = new Gameboard()
  board.placeShip('destroyer1', 0, "x")
  board.receiveAttack(0)

  expect(board.fleet['destroyer1'].status.isSunk).toBeTruthy()
})

it('board can correctly report if all ships sunk', () => {
  const board = new Gameboard()

  Object.values(board.fleet).forEach((ship) => {
    ship.hit()
    ship.hit()
    ship.hit()
  })

  expect(board.allShipsSunk()).toBeFalsy()

  Object.values(board.fleet).forEach((ship) => {
    ship.hit()
  })

  expect(board.allShipsSunk()).toBeTruthy()
})

