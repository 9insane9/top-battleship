const round = require('../src/round')

it('can select game mode', () => {
  const newRound = round()
  newRound.selectGameMode('ai')

  expect(newRound.getGameMode()).toBe('ai')
})

it('throws error on invalid game mode', () => {
  const newRound = round()

  expect(() => newRound.selectGameMode('bootsWithTheFur')).toThrow('Invalid game mode!')
})

