import React, { useState } from 'react';
const QuizContext = React.createContext({
  quizContainer: [],
  quizAddHandler: () => {},
  quizClearHandler: () => {},
  totalQuestions: 5,
  setTotalQsnHandler: () => {},
});

export const QuizContextProvider = (props) => {
  const [quizContainer, setQuizContainer] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const quizAddHandler = (item) => {
    setQuizContainer((prevQuizContainer) => {
      //       console.log(prevQuizContainer);
      return [...prevQuizContainer, item];
    });
  };
  const quizClearHandler = () => {
    setQuizContainer([]);
  };
  const setTotalQsnHandler = (value) => {
    setTotalQuestions(value);
  };

  const quizData = {
    quizContainer,
    quizAddHandler,
    quizClearHandler,
    totalQuestions,
    setTotalQsnHandler,
  };
  return (
    <QuizContext.Provider value={quizData}>
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizContext;
