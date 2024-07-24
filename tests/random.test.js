const genRandomLayout = require('../src/random')
const Gameboard = require('../src/gameboard')

it('board contains correct elements', () => {
  const player1board = new Gameboard()
  const player1randomBoard = genRandomLayout(player1board)
  const boardState = player1randomBoard.boardState
  
  expect(boardState).toContain('battleship1')
  expect(boardState).not.toContain('randomGarbage')
})

it('random layout function places ships randomly until all are placed', () => {
  function TestRandomPlacement(values) {
    this.values = values
    this.index = 0
}

  TestRandomPlacement.prototype.nextValue = function() {
      if (this.index < this.values.length) {
        const current = this.values[this.index++]
        return current
      } else {
        throw new Error("No more custom random values available")
      }
  }

const customRandom = new TestRandomPlacement([
  {position: 0, orientation: "x"},  //1
  {position: 2, orientation: "x"},  //1
  {position: 4, orientation: "x"},  //1
  {position: 6, orientation: "x"},  //1
  {position: 20, orientation: "x"}, //2
  {position: 21, orientation: "x"}, //error value
  {position: 40, orientation: "x"}, //2
  {position: 60, orientation: "x"}, //2
  {position: 24, orientation: "x"}, //3
  {position: 44, orientation: "x"}, //3
  {position: 49, orientation: "x"}, //error value
  {position: 64, orientation: "y"}, //4
  ])

  const boundNextValue = customRandom.nextValue.bind(customRandom)

  function testRandomLayout(playerBoard) {
    const player1randomBoard = genRandomLayout(playerBoard, boundNextValue)
    return player1randomBoard
  }

  const player1board = new Gameboard()
  const player1randomBoard = testRandomLayout(player1board)
  const boardState = player1randomBoard.boardState

  expect(boardState).toContain('battleship1');
  expect(boardState).toContain('cruiser1');
  expect(boardState).not.toContain('randomGarbage');
})