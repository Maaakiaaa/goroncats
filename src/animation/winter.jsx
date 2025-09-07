import React, { useState, useEffect } from 'react'
import './animation.css'

export default function Winter() {
  const scenes = [
    { image: '/yuki.jpg', text: '「もしも、あの時ねこまるを拾ってなかったら…」' },
    { image: '/yuki.jpg', text: 'ねこまるは僕に寄り添い' },
    { image: '/yuki.jpg', text: '「ありがとう」っと言いたげに喉を鳴らしている' },
    { image: '/kotatu.jpg', text: '「寒いね、ねこまる。こたつに入ろうか。」' },
    { image: '/kotatu.jpg', text: 'そう声をかけると、ねこまるはすぐにこたつ布団の中へ潜り込んだ。' },
    { image: '/kotatu.jpg', text: '僕はみかんをむきながら、ねこまるの寝息を聞いていた。' },
    { image: '/kotatu.jpg', text: 'こたつの中はふたりだけの世界だった。' },
    { image: '/kotatu.jpg', text: '「ずっとこうしていられたらいいね。」' }
  ]

  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [typing, setTyping] = useState(false)
  // autoplay flag handled elsewhere; auto-advance will be scheduled after typing completes

  // If we were navigated here by Start button, autoplay
  useEffect(() => {
    try {
      const v = sessionStorage.getItem('animationAutoplay')
      if (v === '1') {
        setPlaying(true)
        sessionStorage.removeItem('animationAutoplay')
      }
    } catch (e) {}
  }, [])

  // Typing effect: when index changes, type the scene text
  useEffect(() => {
    let charTimer = null
    let advTimer = null
    setDisplayedText('')
    setTyping(true)
    const text = scenes[index].text || ''
    const speed = 75 // ms per char

    // function to type the next character by index
    const typeChar = (i) => {
      // if component unmounted or index changed, stop
      if (!text || i >= text.length) {
        setTyping(false)
        // schedule auto-advance only after typing completes
        if (playing) {
          advTimer = setTimeout(() => {
            // if this is the last scene, go to Quiz ('hello'), otherwise next scene
            if (index >= scenes.length - 1) {
              location.hash = 'hello'
            } else {
              setIndex(s => s + 1)
            }
          }, 1500) // 1.5 seconds after complete
        }
        return
      }
      // append the character
      setDisplayedText(prev => prev + text.charAt(i))
      // schedule next
      charTimer = setTimeout(() => typeChar(i + 1), speed)
    }

    // start typing from first character (index 0)
      if (text.length === 0) {
      setTyping(false)
      if (playing) {
        advTimer = setTimeout(() => {
          if (index >= scenes.length - 1) {
            location.hash = 'hello'
          } else {
            setIndex(s => s + 1)
          }
        }, 1500)
      }
    } else {
      // start immediately with first char
      typeChar(0)
    }

    return () => {
      if (charTimer) clearTimeout(charTimer)
      if (advTimer) clearTimeout(advTimer)
    }
  }, [index, playing])

  

  const next = () => setIndex(i => Math.min(i + 1, scenes.length - 1))
  const prev = () => setIndex(i => Math.max(i - 1, 0))
  const goHome = () => { location.hash = 'home' }

  

  return (
  <div className="animation-root">
      <div className="scene">
        <img src={scenes[index].image} alt="scene" className="scene-image" />
        <div className="scene-text" key={index}>
          <span className="typing-text">{displayedText}</span>
          <span className={`typing-caret ${typing ? 'active' : ''}`}>|</span>
        </div>
      </div>
    </div>
  )
}
