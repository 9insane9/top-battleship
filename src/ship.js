const Ship = function(shipLength) {
  const ship = {
    length: shipLength, 
    hits: 0, 
    isSunk: false,
  }

  function hit() {
    ship['hits'] = ship['hits'] + 1
    isSunk()
    return ship
  }

  function isSunk() {
    ship.hits === ship.length ? ship.isSunk = true : null
  }

  return { ship, hit }
}

module.exports = Ship