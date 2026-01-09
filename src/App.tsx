import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UploadPage } from './components/UploadPage';
import { InterviewPage } from './components/InterviewPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/interview" element={<InterviewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
