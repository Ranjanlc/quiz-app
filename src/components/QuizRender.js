import { Fragment, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import classes from './QuizRender.module.css';
import Card from '../Layout/Card';
import { reportTeller } from '../helpers/helper';
import { shuffleArray } from '../helpers/helper';
import Button from '../Layout/Button';
let data = [];
let totalCorrectAns = 0;
const QuizRender = (props) => {
  const [questionSet, setQuestionSet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [curQuestionNum, setCurQuestionNum] = useState(0);
  const params = useParams();
  const navigate = useNavigate();
  const quizTopic = params.quizTopic;
  const limit = 5;
  console.log(curQuestionNum === limit);
  // console.log(curQuestion);
  const sendReq = useCallback(async () => {
    setIsLoading(true);

    // console.log(params);

    const res = await fetch(
      `https://the-trivia-api.com/api/questions?${
        quizTopic !== 'mixed' ? `categories=${quizTopic}&` : ''
      }limit=${limit}`
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
    // Guarding to avoid executing this function while clicking in spaces between listss.

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
  return (
    <Card>
      {isLoading && <p>Loading....</p>}

      {questionSet.length !== 0 && curQuestionNum !== limit && (
        <section className={classes.section}>
          <div className={classes.question}>Q) {displayQn}</div>
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
      {curQuestionNum === limit && (
        <Fragment>
          <div className={classes.scoreboard}>
            Your Score:{totalCorrectAns}/{limit}
          </div>
          <p className={classes.report}>
            {reportTeller(totalCorrectAns, limit)}
          </p>
          <div className={classes.retakeQuizContainer}>
            <Link to="/quiz" className={classes.button}>
              Take the quiz again
            </Link>
          </div>
        </Fragment>
      )}
      {/* TODO:Show curQuestion/totalQn number */}
    </Card>
  );
};
export default QuizRender;
