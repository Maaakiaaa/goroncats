// QuizForm.tsx
//import { saveQuiz } from '../services/quizService';
//テスト上書きする


function QuizForm() {
  const handleClick = () => {
    const quiz = {
      question: '犬福の好物は？',
      choices: ['骨', 'おにぎり', '魚', 'チョコ'],
      correctIndex: 1,
      genre: '犬福知識'
    };
    //saveQuiz(quiz);
  };

  //return <button onClick={handleClick}>保存する</button>;
}