const round = require('../src/round')

it('smart AI can beat player that attacks 0-100', async () => {
  const newRound = round()
  
  // newRound.menu().toggleDifficulty()
  newRound.menu().startGame()

  function simulateGame() {
    for (let pos = 0; pos < 100; pos++) {
      if (newRound.getGameOver()) break

      try {
        newRound.playTurn(pos)
        // console.log(newRound.boards.player.boardState)
        // console.log(newRound.shots.ai)
        // console.log(newRound.getAiState())
        // console.log(newRound.shots.ai)
      } catch (error) {
        console.error('Error during playTurn:', error)
        break
      }
    }
  }

  simulateGame()

  let winner = newRound.checkIfWin()

  expect(winner).toBe("ai")
}, 30000)