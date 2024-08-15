import music from './audio/battleship56-2.mp3' //first game soundtrack, yay
import positive from './audio/positive.mp3'
import negative from './audio/negative.mp3'
import hover from './audio/hover.mp3'
import click from './audio/click.mp3'
import start from './audio/start.mp3'
import win from './audio/win.mp3'
import lose from './audio/lose.mp3'

export const audio = function() {
  const soundBtnEl = document.querySelector('.sound-btn')
  const musicEl = document.createElement('audio')
  const effectEl = document.createElement('audio')
  const menuSoundEl = document.createElement('audio')
  const winLoseEl = document.createElement('audio')

  let isMusicStarted = false
  let isMusicPlaying = false

  musicEl.setAttribute('loop', 'loop')

  musicEl.style.display = "none"
  effectEl.style.display = "none"
  winLoseEl.style.display = "none"
  winLoseEl.volume = 0
  effectEl.volume = 0
  menuSoundEl.volume = 0
  musicEl.volume = 0.8
  musicEl.src = music

  function initMusicAndButton() {

    soundBtnEl.addEventListener('click', () => {

      if (!isMusicStarted && !isMusicPlaying) {
      isMusicStarted = true
      isMusicPlaying = true
      effectEl.volume = 0.35
      winLoseEl.volume = 0.6
      menuSoundEl.volume = 0.5
      soundBtnEl.textContent = '🔊'
      // soundBtnEl.textContent = '\u{1F50A}'
      musicEl.play()
      } else if (isMusicStarted && isMusicPlaying) {
        isMusicPlaying = false
        soundBtnEl.textContent = '🔇'
        // soundBtnEl.textContent = '\u{1F507}'
        musicEl.volume = 0
        effectEl.volume = 0
        menuSoundEl.volume = 0
        winLoseEl.volume = 0
      } else if (isMusicStarted && !isMusicPlaying) {
        isMusicPlaying = true
        soundBtnEl.textContent = '🔊'
        // soundBtnEl.textContent = '\u{1F50A}'
        musicEl.volume = 0.8
        effectEl.volume = 0.35
        menuSoundEl.volume = 0.5
        winLoseEl.volume = 0.6
      }
    })
  }

  function playPositive() {
    effectEl.src = positive
    effectEl.play()
  }

  function playNegative() {
    effectEl.src = negative
    effectEl.play()
  }

  function playHover() {
    menuSoundEl.src = hover
    if (effectEl.volume !== 0.0) {
    menuSoundEl.play() }
    console.log("Hover!")
  }

  function playClick() {
    menuSoundEl.src = click
    if (effectEl.volume !== 0.0) {
      menuSoundEl.play() }
    console.log("Click!")
  }

  function playStart() {
    menuSoundEl.src = start
    if (effectEl.volume !== 0.0) {
      menuSoundEl.play() }
    console.log("Start pressed!")
  }

  function playEnd(winner) {
    if (winner === "player") {
      winLoseEl.src = win
    } else if (winner === "ai"){
      winLoseEl.src = lose
    }

    winLoseEl.volume = 0.6
    winLoseEl.play()

    if (isMusicPlaying) { //if music playing, mute temporarily
      musicEl.volume = 0.05
    } 

    setTimeout(() => {
      const targetVolume = 0.8
      const duration = 3000
      const increment = 0.1
      const intervalTime = duration / (targetVolume / increment)
  
      let currentVolume = musicEl.volume
  
      const volumeInterval = setInterval(() => {
        if (currentVolume >= targetVolume) {
          clearInterval(volumeInterval)
        } else {
          currentVolume = Math.min(currentVolume + increment, targetVolume)
          musicEl.volume = currentVolume
        }
      }, intervalTime)
    }, 3000)


  }

  return {
    initMusicAndButton,
    playPositive,
    playNegative,
    playHover,
    playClick,
    playStart,
    playEnd
  }
}