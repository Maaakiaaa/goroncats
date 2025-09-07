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
      } else {
        // default to playing so scenes auto-advance like other seasons
        setPlaying(true)
      }
    } catch (e) {}
  }, [])

  // Typing effect: when index changes, type the scene text
  useEffect(() => {
    // Unicode-safe per-character typing using Array.from
    const timers = []
    let advTimer = null
    setDisplayedText('')
    setTyping(true)
    const text = scenes[index].text || ''
    const speed = 75 // ms per char

    const chars = Array.from(text)

    const typeChar = (i) => {
      if (i >= chars.length) {
        setTyping(false)
        if (playing) {
          advTimer = setTimeout(() => {
            if (index >= scenes.length - 1) {
              location.hash = 'result'
            } else {
              setIndex(s => s + 1)
            }
          }, 1500)
        }
        return
      }

      setDisplayedText(prev => prev + chars[i])
      const t = setTimeout(() => typeChar(i + 1), speed)
      timers.push(t)
    }

    if (chars.length === 0) {
      setTyping(false)
      if (playing) {
        advTimer = setTimeout(() => {
          if (index >= scenes.length - 1) {
            location.hash = 'result'
          } else {
            setIndex(s => s + 1)
          }
        }, 1500)
      }
    } else {
      typeChar(0)
    }

    return () => {
      timers.forEach(t => clearTimeout(t))
      if (advTimer) clearTimeout(advTimer)
    }
  }, [index, playing])

  

  // navigation handled automatically after typing completes

  

  return (
  <div className="animation-root">
      <div className="scene">
        <img src={scenes[index].image} alt="scene" className="scene-image" />
        <div className="scene-text" key={index}>
          <span className="typing-text">{displayedText}</span>
          <span className={`typing-caret ${typing ? 'active' : ''}`}>|</span>
        </div>
  {/* manual navigation removed - scenes advance automatically */}
      </div>
    </div>
  )
}
