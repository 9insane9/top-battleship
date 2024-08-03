// const aiFn = require('../src/ai')
const round = require('../src/round')
// const genRandomLayout = require('../src/random')

// it('', () => {

//   expect('works').toBe('works')
// })

it('smart AI can beat player that just attacks 0-100', async () => {
  const newRound = round()
  // let ai = aiFn

  newRound.menu().toggleDifficulty()
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

  // expect(() => newRound.boards.ai.fleet['destroyer1'].status.isSunk).toBeTruthy()
  expect(() =>  newRound.getGameOver()).toBeTruthy()
  expect(() =>  newRound.checkIfWin()).toStrictEqual("ai")
}, 30000)