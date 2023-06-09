import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classes from './QuizRender.module.css';
import Card from '../Layout/Card';
import { reportTeller } from '../helpers/helper';
import { shuffleArray } from '../helpers/helper';
import LoadingSpinner from '../Layout/LoadingSpinner';
import QuizContext from '../store/quiz-context';
import { decode } from 'html-entities';
import StopwatchIcon from '../assets/stop-watch';
import clock from '../assets/clock.wav';

const QuizRender = (props) => {
  const quizCtx = useContext(QuizContext);
  const [questionSet, setQuestionSet] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState('');
  const [curQuestionNum, setCurQuestionNum] = useState(0);
  const [startTimer, setStartTimer] = useState(false);
  const [curTime, setCurTime] = useState();
  const [totalCorrectAns, setTotalCorrectAns] = useState(0);
  const [answerId, setAnswerId] = useState(null);
  const [clockAudio] = useState(new Audio(clock));
  const [stopTimer, setStopTimer] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  const quizTopic = params.quizTopic;
  const totalQsnNum = quizCtx.totalQuestions;
  const curQuestionSet = questionSet[curQuestionNum];
  const displayQn = curQuestionSet?.question;
  const curQsnNumRef = useRef();
  const sendReq = useCallback(async () => {
    setIsLoading(true);
    const res = await fetch(
      `https://opentdb.com/api.php?amount=${totalQsnNum}&type=multiple&${
        quizTopic !== 'mixed' ? `category=${quizTopic}` : ''
      }`
    );
    const { results } = await res.json();
    // used decode to get rid of html entities
    const refinedSet = results.map((item) => {
      const { question, correct_answer, incorrect_answers } = item;
      const correctAnswer = decode(correct_answer);
      const incorrectAnswers = incorrect_answers.map((item) => decode(item));
      const answersArr = shuffleArray([...incorrectAnswers, correctAnswer]);
      const answerObj = answersArr.map((answer, i) => {
        return { id: i, answer };
      });
      return {
        question: decode(question),
        correctAnswer,
        answerObj,
      };
    });
    console.log(refinedSet);
    setIsLoading(false);
    setQuestionSet(refinedSet);
    setStartTimer(true);
  }, []);
  useEffect(() => {
    // To make the curQsnNum availabe inside the following useEffect.
    curQsnNumRef.current = curQuestionNum;
  }, [curQuestionNum]);
  useEffect(() => {
    // For sending request
    questionSet.length === 0 && sendReq();
    // For setting time.
    const tick = function () {
      const min = `${Math.floor(time / 60)}`.padStart(2, 0);
      const sec = String(time % 60).padStart(2, 0);
      setCurTime(`${min}:${sec}`);
      console.log(min, sec);
      if (time === 10) {
        clockAudio.play();
      }
      if (time === 0) {
        clearInterval(timer);
        setStartTimer(false);
        for (let i = curQsnNumRef.current; i < totalQsnNum; i++) {
          quizCtx.quizAddHandler(questionSet[i]);
        }
        // Just to load the fallback UI
        setCurQuestionNum(totalQsnNum);
      }
      time--;
    };
    let time = 25 * (totalQsnNum / 5);
    tick();
    const timer = startTimer && setInterval(tick, 1000);
    stopTimer && clearInterval(timer);
    return () => {
      clearInterval(timer);
    };
  }, [sendReq, startTimer, stopTimer]);

  const listClickHandler = (item, id) => {
    setAnswerId(id);
    setAnswer(item);
  };
  const answerSet = curQuestionSet?.answerObj.map(({ answer, id }) => {
    return (
      <li
        onClick={listClickHandler.bind(null, answer, id)}
        key={id}
        className={id === answerId ? classes.clicked : ''}
      >
        {answer}
      </li>
    );
  });
  const answerSubmitHandler = () => {
    const questionSet = { ...curQuestionSet, enteredAnswer: answer };
    quizCtx.quizAddHandler(questionSet);
    setAnswerId(null);
    setCurQuestionNum((curNum) => ++curNum);
    if (curQuestionSet.correctAnswer === answer) {
      setTotalCorrectAns((prevState) => ++prevState);
    }
    setAnswer('');
  };
  const retakeQuizHandler = () => {
    quizCtx.quizClearHandler();
    navigate('/quiz');
  };
  const resultsClickHandler = () => {
    props.viewResultHandler();
    navigate('/quiz-result');
  };
  const fallbackUI = useMemo(() => {
    return (
      <Fragment>
        <div className={classes.scoreboard}>
          Your Score:{totalCorrectAns}/{totalQsnNum}
        </div>
        <p className={classes.report}>
          {reportTeller(totalCorrectAns, totalQsnNum)}
        </p>
        <div className={classes.retakeQuizContainer}>
          <button onClick={resultsClickHandler} className={classes.button}>
            View Results
          </button>
          <hr style={{ height: '30px' }} />
          <button onClick={retakeQuizHandler} className={classes.button}>
            Take the quiz again
          </button>
        </div>
      </Fragment>
    );
  }, [totalCorrectAns, totalQsnNum]);
  if (curQuestionNum === totalQsnNum && !stopTimer) {
    clockAudio.pause();
    setStopTimer(true);
  }
  return (
    <Fragment>
      {isLoading && <LoadingSpinner />}
      {startTimer && curQuestionNum !== totalQsnNum && (
        <div
          className={`${classes.timer} ${
            +curTime.slice(-2) <= 10 ? classes.flicker : ''
          }`}
        >
          <StopwatchIcon />
          {curTime}
        </div>
      )}
      {questionSet.length !== 0 && (
        <Card>
          {curQuestionNum === totalQsnNum ? fallbackUI : ''}
          {curQuestionNum !== totalQsnNum && (
            <section className={classes.section}>
              <div className={classes.question}>
                Q{curQuestionNum + 1}) {displayQn}
              </div>
              <ul
                className={classes.answer}
                onClick={answerContainerClickHandler}
              >
                {answerSet}
              </ul>
              <hr />
              <div className={classes.container}>
                <button
                  onClick={answerSubmitHandler}
                  className={classes.button}
                  disabled={answer.length === 0}
                >
                  {curQuestionNum === totalQsnNum - 1
                    ? 'Finish'
                    : 'Next Question'}
                </button>
              </div>
            </section>
          )}
          {/* TODO:Show curQuestion/totalQn number */}
        </Card>
      )}
    </Fragment>
  );
};
export default QuizRender;
