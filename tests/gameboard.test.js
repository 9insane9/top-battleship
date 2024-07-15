const Gameboard = require('../src/gameboard')

//a
it('place specific ship starting from coordinate', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5)

  expect(board.boardState[5]).toBe("battleship1")
  expect(board.boardState[6]).toBe("battleship1")
  expect(board.boardState[7]).toBe("battleship1")  
})

//b
it('cannot place overlapping ships', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5)
  
  expect(() => board.placeShip('battleship2', 4)).toThrow('Invalid placement: Ships cannot overlap! (H)')
})

//c
it('cannot place duplicate ship', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5)

  expect(() => board.placeShip('battleship1', 12)).toThrow('Invalid placement: Ship already on board!')
})

//d
it('cannot place ship out of bounds', () => {
  const board = new Gameboard()
  
  expect(() => board.placeShip('battleship1', 87, "y")).toThrow('Invalid placement: Out of bounds! (V)')
  expect(() => board.placeShip('battleship2', 99)).toThrow('Invalid placement: Out of bounds! (H)')
})

//e
// it('must leave one space between ships horizontally', () => {
//   const board = new Gameboard()
//   board.placeShip('battleship1', 0)
  
//   expect(() => board.placeShip('battleship2', 3)).toThrow('Invalid placement: Must leave a gap (H)!')
// })

//f
// it('must leave one space between ships vertically', () => {
//   const board = new Gameboard()
//   board.placeShip('battleship1', 0)
  
//   expect(() => board.placeShip('battleship2', 10)).toThrow('Invalid placement: Must leave a gap (V)!')
// })