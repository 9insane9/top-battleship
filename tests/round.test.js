const round = require('../src/round')

it('populates boards when run', () => {
  const newRound = round()

  expect(newRound.boards.player.boardState).toContain('battleship1')
})

it('can start game and finish game', async () => {
  const newRound = round()

  newRound.menu().startGame()

  async function simulateGame() {
    for (let pos = 0; pos < 100 && !newRound.getGameOver(); pos++) {
      try {
        await newRound.playTurn(pos)
      } catch (error) {
        console.error('Error during playTurn:', error)
        break
      }
      if (newRound.getGameOver()) {
        break
      }
    }
  }

  await simulateGame()

  expect(() => newRound.boards.ai.fleet['destroyer1'].status.isSunk).toBeTruthy()
  expect(() => { newRound.getGameOver() }).toBeTruthy()
}, 30000)

