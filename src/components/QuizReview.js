import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../Layout/Card';
import QuizContext from '../store/quiz-context';
import duplicateClasses from './QuizRender.module.css';
import classes from './QuizReview.module.css';
const QuizReview = (props) => {
  const [curQuestionNum, setCurQuestionNum] = useState(0);
  const ctx = useContext(QuizContext);
  const navigate = useNavigate();
  const { quizContainer } = ctx;
  console.log(quizContainer);
  const totalQsnNum = quizContainer.length;
  const curQuizSet = quizContainer[curQuestionNum];
  const {
    question: displayQn,
    enteredAnswer: curEnteredAns,
    correctAnswer: curCorrectAns,
  } = curQuizSet;
  // const {enteredAnswer:curEnteredAns} = curQuizSet.enteredAnswer;
  // const curCorrectAns = curQuizSet.correctAnswer;
  const listGenerator = (answer, className, msg = '') => {
    return (
      <li key={answer} id={answer} className={className}>
        {msg !== '' ? `${msg}: ${answer}` : `${answer}`}
      </li>
    );
  };
  const answerSet = curQuizSet.answerObj.map(({ answer, id }) => {
    if (answer === curEnteredAns && answer === curCorrectAns) {
      return listGenerator(answer, classes.correctAnswer, 'Correct');
    } else if (answer === curEnteredAns) {
      return listGenerator(answer, classes.incorrectAnswer, 'Incorrect');
    } else if (answer === curCorrectAns) {
      return listGenerator(answer, classes.correctAnswer, 'Correct');
    }
    return listGenerator(answer);
  });
  const questionNumChangeHandler = () => {
    if (curQuestionNum + 1 === totalQsnNum) {
      setCurQuestionNum(0);
      ctx.quizClearHandler();
      navigate('/quiz');
    }
    setCurQuestionNum((curNum) => ++curNum);
  };
  return (
    <Card>
      <section className={duplicateClasses.section}>
        <div className={duplicateClasses.question}>
          Q{curQuestionNum + 1}) {displayQn}
          {!curEnteredAns ? (
            <span className={classes.unanswered}>Unanswered</span>
          ) : (
            ''
          )}
        </div>
        <ul className={classes.answer}>{answerSet}</ul>
        <hr />
        <div className={duplicateClasses.container}>
          <button
            onClick={questionNumChangeHandler}
            className={duplicateClasses.button}
          >
            {curQuestionNum + 1 === totalQsnNum
              ? 'Finish Reviewing'
              : 'Next Question'}
          </button>
        </div>
      </section>
    </Card>
  );
};

export default QuizReview;
