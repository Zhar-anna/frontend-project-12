import React, { useState, useMemo } from 'react';
import {
  BrowserRouter, Routes, Route, Link, Navigate,
} from 'react-router-dom';
import { Navbar, Container } from 'react-bootstrap';
import ErrorPage from './routes/ErrorPage.jsx';
import LoginPage from './routes/LoginPage.jsx';
import ChatPage from './routes/ChatPage.jsx';
import routes from './routes.js';
import SignupPage from './routes/SignUpPage.jsx';
import AuthContext, { useAuth } from './contexts/index.jsx';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const item = localStorage.getItem('userData');
    return item ? JSON.parse(item) : null;
  });
  const logIn = (data) => {
    setUserData(data);
    const stringedData = JSON.stringify(data);
    localStorage.setItem('userData', stringedData);
  };
  const logOut = () => {
    setUserData(null);
    localStorage.removeItem('userData');
  };
  const auth = useMemo(() => ({ userData, logIn, logOut }), [userData]);
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  return auth.userData ? children : <Navigate to={routes.loginPage} />;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <div className="d-flex flex-column vh-100">
        <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
          <Container>
            <Navbar.Brand as={Link} to={routes.homePage}>Hexlet Chat</Navbar.Brand>
          </Container>
        </Navbar>
        <Routes>
          <Route path="*" element={<ErrorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            )}
          />
        </Routes>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
