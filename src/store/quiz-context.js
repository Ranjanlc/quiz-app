import React, { useState } from 'react';
const QuizContext = React.createContext({
  quizContainer: [],
  quizAddHandler: () => {},
  quizClearHandler: () => {},
});

export const QuizContextProvider = (props) => {
  const [quizContainer, setQuizContainer] = useState([]);
  const quizAddHandler = (item) => {
    setQuizContainer((prevQuizContainer) => {
      //       console.log(prevQuizContainer);
      return [...prevQuizContainer, item];
    });
  };
  const quizClearHandler = () => {
    setQuizContainer([]);
  };

  const quizData = {
    quizContainer,
    quizAddHandler,
    quizClearHandler,
  };
  return (
    <QuizContext.Provider value={quizData}>
      {props.children}
    </QuizContext.Provider>
  );
};

export default QuizContext;
