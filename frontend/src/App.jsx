import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorPage from './routes/ErrorPage.jsx';
import LoginPage from './routes/LoginPage.jsx';
import ChatPage from './routes/ChatPage.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="*" element={<ErrorPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ChatPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
