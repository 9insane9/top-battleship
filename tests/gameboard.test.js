const Gameboard = require('../src/gameboard')

it('place specific ship starting from coordinate', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5)

  expect(board.boardState[5]).toBe("battleship1")
  expect(board.boardState[6]).toBe("battleship1")
  expect(board.boardState[7]).toBe("battleship1")  
})

it('cannot place overlapping ships', () => {
  const board = new Gameboard()
  board.placeShip('battleship1', 5)
  
  expect(() => board.placeShip('battleship2', 4)).toThrow('Invalid placement: Ships cannot overlap!')
})