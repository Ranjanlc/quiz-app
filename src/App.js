import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import QuizConfig from './components/QuizConfig';
import QuizRender from './components/QuizRender';
function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const authorizeHandler = (authorizeValue) => {
    setIsAuthorized(authorizeValue);
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
            <QuizRender authorize={authorizeHandler} />
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
