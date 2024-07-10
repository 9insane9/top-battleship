const Ship = require('../src/ship')

it('creates new ship based on length', () => {
  expect(new Ship(3).ship.length).toStrictEqual(3)
})

it('ship can take a hit', () => {
  expect(new Ship(3).hit()).toStrictEqual(
    {
    length: 3, 
    hits: 1,
    isSunk: false,
    }
  )
})

it('can be sunk', () => {
  const ship = new Ship(3);
  ship.hit();
  ship.hit();
  ship.hit();

  expect(ship.ship.isSunk).toBe(true)
  
})