const { round, genRandomLayout } = require('../src/round')
const Gameboard = require('../src/gameboard')

// it('board contains correct elements', () => {
//   const result = round()
//   const player1board = result.player1board
  
//   expect(player1board.boardState).toContain('battleship1')
//   expect(player1board.boardState).toNotContain('randomGarbage')
// })

it('places ships randomly until all are placed', () => {
  function TestRandomPlacement(values) {
    this.values = values
    this.index = 0
}

  TestRandomPlacement.prototype.nextValue = function() {
      if (this.index < this.values.length) {
          return this.values[this.index++]
      } else {
          throw new Error("No more custom random values available")
      }
  }

const customRandom = new TestRandomPlacement([
  {position: 0, orientation: "x"}, //1
  {position: 2, orientation: "x"}, //1
  {position: 4, orientation: "x"}, //1
  {position: 6, orientation: "x"}, //1
  {position: 20, orientation: "y"}, //2
  {position: 40, orientation: "x"},//2
  {position: 60, orientation: "x"}, //2
  {position: 24, orientation: "x"},  //3
  {position: 44, orientation: "x"},  //3
  {position: 64, orientation: "y"},  //4
  ])

  function testRandomLayout(playerBoard) {
    genRandomLayout(playerBoard, customRandom.nextValue.bind(customRandom))
  }

  const gameRound = round(testRandomLayout)
  const player1board = gameRound.player1board

  expect(player1board.boardState).toContain('battleship1');
  expect(player1board.boardState).not.toContain('randomGarbage');
})