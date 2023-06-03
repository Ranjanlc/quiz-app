import Card from '../Layout/Card';
import Button from '../Layout/Button';
import classes from './QuizConfig.module.css';
import { useNavigate } from 'react-router-dom';
import { useContext, useRef, useState } from 'react';
import QuizContext from '../store/quiz-context';
const QuizConfig = (props) => {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState(null);
  const quizCtx = useContext(QuizContext);

  const selectChangeHandler = (e) => {
    setSelectedValue(e.target.value);
  };
  const numberChangeHandler = (e) => {
    quizCtx.setTotalQsnHandler(+e.target.value);
  };
  const quizRenderHandler = () => {
    props.authorize(true);
    console.log(selectedValue);
    navigate(`/quiz/${selectedValue}`);
  };
  return (
    // <Card>
    <main className={classes.wrapper}>
      <section className={classes['moving-border']}>
        <h1>Welcome to the quiz</h1>
        <label htmlFor="select">Choose a Category:</label>
        <select
          id="select"
          onChange={selectChangeHandler}
          defaultValue="--Select an Option--"
        >
          <option disabled hidden>
            --Select an Option--
          </option>
          {/* The value is just for api purposes */}
          <option value="mixed">Mixed</option>
          <option value="9">General Knowledge</option>
          <option value="11">Movies</option>
          <option value="18">Computer</option>
          <option value="19">Maths</option>
          <option value="21">Sports</option>
          <option value="22">Geography</option>
          <option value="23">History</option>
        </select>
        <hr />
        <label>No. of Questions: </label>
        <select
          onChange={numberChangeHandler}
          defaultValue={quizCtx.totalQuestions}
        >
          {/* Only for making the sizes of box equal */}
          <option hidden>-select and option-</option>
          <option>5</option>
          <option>10</option>
          <option>15</option>
          <option>20</option>
        </select>
        <hr />
        <Button onClick={quizRenderHandler} disabled={!selectedValue}>
          Go to Quiz
        </Button>
      </section>
    </main>
    // </Card>
  );
};
export default QuizConfig;
