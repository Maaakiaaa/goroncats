import React from 'react'
import './quiz.css'

export default function Quiz() {
  return (
    
    <div className="quiz">
      <h1 className="quiz-title">問題</h1>
      <p className="quiz-desc">This is the quiz page.</p>
    <div className='quizkaitou'>
      <button type="button" className='quizlabel'>1</button>
      <button type="button" className='quizlabel'>2</button>
      <button type="button" className='quizlabel'>3</button>
      <button type="button" className='quizlabel'>4</button>
    </div>
      
    </div>
  );
}
