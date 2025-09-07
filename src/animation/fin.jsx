import React, { useState, useEffect } from 'react'
import './animation.css'

export default function Fin() {
	const scenes = [
		{ image: '/zinzya.jpg', text: '「ちょっと初詣に行こうか」' },
		{ image: '/zinzya.jpg', text: 'ねこまるを連れて、地元で有名な神社へ向かった。' },
		{ image: '/zinzya.jpg', text: '人混みの中、ねこまるは突然するりと腕を抜けて、どこかへ走り去ってしまった。' },
		{ image: '/zinzya.jpg', text: '慌てて探し回ったが、ねこまるは見つからない。' },
		{ image: '/zinzya.jpg', text: '数日後、近所の公園で、ねこまるが他の猫と楽しそうに過ごしている姿を見かけた。' },
		{ image: '/CatHappy.jpg', text: '――ねこまるは、自分の居場所を見つけたのかもしれない。' },
		{ image: '/CatHappy.jpg', text: '胸にぽっかりと穴が空いたような気持ちで、静かに手を合わせた。' },
		{ image: '/CatHappy.jpg', text: 'ねこまるが幸せでありますように。' },
		{ image: '/CatHappy.jpg', text: 'それだけを、今は願う。' },
		{ image: '/CatHappy.jpg', text: '幸せそうな2人' },
		{ image: '/CatHappy.jpg', text: '俺は、二人を眺めながらそのまま去っていくことにした。' }
	]

	const [index, setIndex] = useState(0)
	const [playing, setPlaying] = useState(true)
	const [displayedText, setDisplayedText] = useState('')
	const [typing, setTyping] = useState(false)

	useEffect(() => {
		try {
			const v = sessionStorage.getItem('animationAutoplay')
			if (v === '1') {
				setPlaying(true)
				sessionStorage.removeItem('animationAutoplay')
			}
		} catch (e) {}
	}, [])

	useEffect(() => {
		const timers = []
		let advTimer = null
		setDisplayedText('')
		setTyping(true)
		const text = scenes[index].text || ''
		const chars = Array.from(text)
		const speed = 75

		const scheduleAdvance = () => {
			if (playing) {
				advTimer = setTimeout(() => {
					if (index >= scenes.length - 1) {
						location.hash = 'home'
					} else {
						setIndex(s => s + 1)
					}
				}, 1500)
			}
		}

		const typeChar = (i) => {
			if (!text || i >= chars.length) {
				setTyping(false)
				scheduleAdvance()
				return
			}
			setDisplayedText(prev => prev + chars[i])
			timers.push(setTimeout(() => typeChar(i + 1), speed))
		}

		if (chars.length === 0) {
			setTyping(false)
			scheduleAdvance()
		} else {
			typeChar(0)
		}

		return () => {
			timers.forEach(t => clearTimeout(t))
			if (advTimer) clearTimeout(advTimer)
		}
	}, [index, playing])

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
