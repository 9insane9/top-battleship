const ai = function() {

}

module.exports = ai

function aiTurn() {
  const tracker = {
    lastHitPos: null,
    lastHitSuccess: false,
    nextTargets: null,
  }

  genRandomPos() //+filterAndPushToPlayer2Hits +tracker.lastHitPos = pos

  if (player1Board.boardState[tracker.lastHitPos]) {
    lastHitSuccess = true
    calcDiagonals() //+filterAndPushToPlayer2Hits
    calcAdjacent() //+filterAndNextTargets = positions
  } else if (lastHitPos !== null) {
    genRandomPos() //tracker.lastHitPos = pos
  }

  //return positionToHit
}