import Card from '../Layout/Card';
import Button from '../Layout/Button';
import classes from './QuizConfig.module.css';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
const QuizConfig = (props) => {
  const navigate = useNavigate();
  const [selectedValue, setSelectedValue] = useState(null);

  const selectChangeHandler = (e) => {
    // console.log(e.target.value);
    setSelectedValue(e.target.value);
  };
  const numberChangeHandler = (e) => {
    props.qsnChangeHandler(e.target.value);
  };
  const quizRenderHandler = () => {
    props.authorize(true);
    navigate(`/quiz/${selectedValue.toLowerCase()?.split(' ')?.join('_')}`);
  };
  return (
    <Card>
      <section className={classes.section}>
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
          <option>Mixed</option>
          <option>Arts and Literature</option>
          <option>Film and TV</option>
          <option>Food and Drink</option>
          <option>General Knowledge</option>
          <option>Geography</option>
          <option>History</option>
          <option>Music</option>
          <option>Science</option>
          <option>Society and culture</option>
          <option>Sports and Leisure</option>
        </select>
        <hr />
        <label>No. of Questions: </label>
        <select onChange={numberChangeHandler} defaultValue="5">
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
    </Card>
  );
};
export default QuizConfig;
