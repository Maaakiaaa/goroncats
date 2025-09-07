import React, { useState, useEffect } from 'react'
import './animation.css'

export default function Autumn() {
  const scenes = [
    { image: '/kazyuen.jpg', text: '（秋のはじまり、猫たちはこたつで丸くなる…）' },
    { image: '/kazyuen.jpg', text: '外はすっかり涼しくなった' },
    { image: '/kazyuen.jpg', text: 'ストーブの前でぬくぬく過ごす猫たち' },
    { image: '/kazyuen.jpg', text: 'ストーブの前でぬくぬく、みんなで丸くなって眠る' },
    { image: '/kazyuen.jpg', text: 'ストーブの前では、みんなで幸せそうに丸くなっている！' },
    { image: '/kazyuen.jpg', text: '寝返りをうった猫が、みんなの上に乗っかってしまった' },
    { image: '/kazyuen.jpg', text: '「丸くなって、もっとあったかくなろうか」' },
    { image: '/kazyuen.jpg', text: 'みんなで重なり合って眠っている。' },
    { image: '/kazyuen.jpg', text: '重なり合いながら、ぬくもりを分け合う猫たち' },
    { image: '/room.png', text: '部屋の中はぬくぬくの幸せ空間だ' },
    { image: '/room.png', text: '重なり合う幸せ、みんなでぬくぬくしている' },
    { image: '/room.png', text: '「おやすみ！おやすみ！」みんなで仲良く眠る夜' },
    { image: '/room.png', text: 'そして、みんな一つ、二つ、三つ…と夢の中へ！' },
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
        // default to playing so scenes auto-advance like Spring/Summer
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
              location.hash = 'autumnquiz'
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
        location.hash = 'autumnquiz'
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