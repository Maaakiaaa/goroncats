import React, { useState, useEffect } from 'react'
import './animation.css'

export default function Fin() {
  const scenes = [
    { image: '/zinzya.jpg', text: '�u������Ə��w�ɍs�������v' },
    { image: '/zinzya.jpg', text: '�˂��܂��A��āA�n���ŗL���Ȑ_�Ђ֌��������B' },
    { image: '/zinzya.jpg', text: '�l���݂̒��A�˂��܂�͓ˑR�����Ƙr�𔲂��āA�ǂ����֑��苎���Ă��܂����B' },
    { image: '/zinzya.jpg', text: '�Q�ĂĒT����������A�˂��܂�͌�����Ȃ��B' },
    { image: '/zinzya.jpg', text: '������A�ߏ��̌����ŁA�˂��܂邪���̔L�Ɗy�������ɉ߂����Ă���p�����������B' },
    { image: '/CatHappy.jpg', text: '�\�\�˂��܂�́A�����̋��ꏊ���������̂�������Ȃ��B' },
    { image: '/CatHappy.jpg', text: '���ɂۂ�����ƌ����󂢂��悤�ȋC�����ŁA�Â��Ɏ�����킹���B' },
    { image: '/CatHappy.jpg', text: '�˂��܂邪�K���ł���܂��悤�ɁB' },
    { image: '/CatHappy.jpg', text: '���ꂾ�����A���͊肤�B' },
    { image: '/CatHappy.jpg', text: '�K��������2�l' }
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
