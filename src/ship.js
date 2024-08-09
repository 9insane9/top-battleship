const Ship = function(shipLength) {
  const status = {
    length: shipLength, 
    position: null,
    axis: null,
    hits: 0, 
    isSunk: false,
  }

  function hit() {
    status.hits += 1
    isSunk()
    return status
  }

  function isSunk() {
    status.hits === status.length ? status.isSunk = true : null
  }

  return { status, hit }
}

module.exports = Ship