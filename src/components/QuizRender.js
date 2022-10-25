import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classes from './QuizRender.module.css';
import Card from '../Layout/Card';
import { reportTeller } from '../helpers/helper';
import { shuffleArray } from '../helpers/helper';
import LoadingSpinner from '../Layout/LoadingSpinner';
let data = [];
let totalCorrectAns = 0;
const QuizRender = (props) => {
  const [questionSet, setQuestionSet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [curQuestionNum, setCurQuestionNum] = useState(0);
  const params = useParams();
  const quizTopic = params.quizTopic;
  const totalQsnNum = +props.totalQsn;
  const sendReq = useCallback(async () => {
    setIsLoading(true);

    const res = await fetch(
      `https://the-trivia-api.com/api/questions?${
        quizTopic !== 'mixed' ? `categories=${quizTopic}&` : ''
      }limit=${totalQsnNum}`
    );
    data = await res.json();
    const refinedSet = data.map((item) => {
      return {
        question: item.question,
        correctAnswer: item.correctAnswer,
        answerSet: shuffleArray([...item.incorrectAnswers, item.correctAnswer]),
      };
    });
    setIsLoading(false);
    setQuestionSet(refinedSet);
  }, [params]);
  useEffect(() => {
    sendReq();
  }, [sendReq]);
  //
  const answerContainerClickHandler = (e) => {
    if (Array.from(e.target.classList).some((item) => item === classes.answer))
      return;
    // Guarding to avoid executing this function while clicking in spaces between lists.

    e.target.classList.add(classes.clicked);
    const element = Array.from(
      e.target.parentElement.querySelectorAll('li')
    ).filter((el) => el !== e.target);
    element.forEach((el) => el.classList.remove(classes.clicked));
  };
  const listClickHandler = (item) => {
    setAnswer(item);
  };

  const curQuestionSet = questionSet[curQuestionNum];
  const displayQn = curQuestionSet?.question;
  const answerSet = curQuestionSet?.answerSet.map((item) => {
    return (
      <li onClick={listClickHandler.bind(null, item)} key={item}>
        {item}
      </li>
    );
  });
  const answerSubmitHandler = () => {
    setCurQuestionNum((curNum) => ++curNum);
    if (curQuestionSet.correctAnswer === answer) {
      totalCorrectAns++;
    }
    setAnswer('');
  };
  console.log(curQuestionNum, totalQsnNum);
  const fallbackUI = curQuestionNum === totalQsnNum && (
    <Fragment>
      <div className={classes.scoreboard}>
        Your Score:{totalCorrectAns}/{totalQsnNum}
      </div>
      <p className={classes.report}>
        {reportTeller(totalCorrectAns, totalQsnNum)}
      </p>
      <div className={classes.retakeQuizContainer}>
        <Link to="/quiz" className={classes.button}>
          Take the quiz again
        </Link>
      </div>
    </Fragment>
  );
  if (curQuestionNum === totalQsnNum) {
    totalCorrectAns = 0;
  }
  return (
    <Card>
      {isLoading && <LoadingSpinner />}
      {fallbackUI}
      {questionSet.length !== 0 && curQuestionNum !== totalQsnNum && (
        <section className={classes.section}>
          <div className={classes.question}>
            Q{curQuestionNum + 1}) {displayQn}
          </div>
          <ul className={classes.answer} onClick={answerContainerClickHandler}>
            {answerSet}
          </ul>
          <hr />
          <div className={classes.container}>
            <button
              onClick={answerSubmitHandler}
              className={classes.button}
              disabled={answer.length === 0}
            >
              Next Question
            </button>
          </div>
        </section>
      )}
      {/* TODO:Show curQuestion/totalQn number */}
    </Card>
  );
};
export default QuizRender;
