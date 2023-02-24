import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './routes/ErrorPage.jsx';
import LoginPage from './routes/LoginPage.jsx';
import ChatPage from './routes/ChatPage.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<ErrorPage />} />
      <Route path="/" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
