import React from "react";

const Quiz = () => {
  return (
    <div className="quiz-container">
      <h2>クイズ画面</h2>
  {/* テキストボックス1 */}
  <input type="text" className="quiz-input" readOnly/>
  {/* テキストボックス2 */}
  <input type="text" className="quiz-answer" readOnly/>
  {/* ここにクイズの内容を追加してください */}
    </div>
  );
};

export default Quiz;
