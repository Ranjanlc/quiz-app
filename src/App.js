import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import QuizConfig from './components/QuizConfig';
import QuizRender from './components/QuizRender';
function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [totalQsn, setTotalQsn] = useState(5);
  const authorizeHandler = (authorizeValue) => {
    setIsAuthorized(authorizeValue);
  };
  const numberChangeHandler = (number) => {
    setTotalQsn(number);
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" />} />
      <Route
        path="/quiz"
        element={
          <QuizConfig
            authorize={authorizeHandler}
            qsnChangeHandler={numberChangeHandler}
          />
        }
      />
      <Route
        path="/quiz/:quizTopic"
        element={
          isAuthorized ? (
            <QuizRender authorize={authorizeHandler} totalQsn={totalQsn} />
          ) : (
            <Navigate to="/quiz" />
          )
        }
      />

      {/* TODO:Add a not found page */}
      <Route path="*" element={<QuizConfig />} />
    </Routes>
  );
}

export default App;
