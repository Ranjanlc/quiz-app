import { decode } from 'html-entities';
import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import QuizConfig from './components/QuizConfig';
import QuizRender from './components/QuizRender';
import QuizReview from './components/QuizReview';
function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [resultViewable, setResultViewable] = useState(false);
  const [totalQsn, setTotalQsn] = useState(5);
  const authorizeHandler = (authorizeValue) => {
    setIsAuthorized(authorizeValue);
  };
  const resultViewHandler = () => {
    setResultViewable(true);
  };
  const numberChangeHandler = (number) => {
    console.log(number);
    setTotalQsn(number);
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/quiz" />} />
      <Route
        path="/quiz"
        element={<QuizConfig authorize={authorizeHandler} />}
      />
      <Route
        path="/quiz/:quizTopic"
        element={
          isAuthorized ? (
            <QuizRender
              authorize={authorizeHandler}
              totalQsn={totalQsn}
              viewResultHandler={resultViewHandler}
            />
          ) : (
            <Navigate to="/quiz" />
          )
        }
      />
      <Route
        path="/quiz-result"
        element={resultViewable ? <QuizReview /> : <Navigate to="/quiz" />}
      />
      {/* TODO:Add a not found page */}
      <Route path="*" element={<QuizConfig />} />
    </Routes>
  );
}

export default App;
