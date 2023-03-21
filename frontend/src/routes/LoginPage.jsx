import { useFormik } from 'formik';
import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import * as yup from 'yup';
import {
  Button, Form,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tota from '../images/Tota.jpg';
// import { useAuth } from '../contexts/index.jsx';
import routes from '../routes.js';

const validationSchema = yup.object().shape({
  username: yup.string().trim(),
  password: yup.string().trim(),
});

const useSubmit = (setAuthFailed) => {
  // const { logIn } = useAuth();
  // const auth = useAuth();
  const navigate = useNavigate();
  // const inputRef = useRef();
  return async (values) => {
    setAuthFailed(false);
    try {
      const { data } = await axios.post(routes.login, values);
      if (data.token) {
        // const user = { token: data.token, username: data.username };
        // auth.userLogIn(user);
        // logIn(user);
        localStorage.setItem('token', JSON.stringify(data.token));
        navigate(routes.homePage);
      }
    } catch (error) {
      if (!error.isAxiosError) {
        toast.error('Неизвестная ошибка');
        console.error(error);
      }
      if (error.isAxiosError && error.response?.status === 401) {
        setAuthFailed(true);
        // inputRef.current.select();
      } else {
        toast.error('Ошибка сети');
      }
    }
  };
};
const LoginPage = () => {
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: useSubmit(setAuthFailed),
  });

  return (
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img
                  src={tota}
                  alt="Welcome"
                  className="rounded-circle"
                />
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">Войти</h1>
                <fieldset disabled={formik.isSubmitting}>
                  <Form.Group className="form-floating mb-3" controlId="username">
                    <Form.Control
                      name="username"
                      type="username"
                      placeholder="Ваш ник"
                      autoComplete="username"
                      required
                      autoFocus
                      isInvalid={authFailed || (formik.touched.username && formik.errors.username)}
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      ref={inputRef}
                    />
                    <Form.Label className="form-label">Ваш ник</Form.Label>
                  </Form.Group>
                  <Form.Group className="form-floating mb-4" controlId="password">
                    <Form.Control
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Пароль"
                      required
                      isInvalid={authFailed || (formik.touched.password && formik.errors.password)}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <Form.Label className="form-label">Пароль</Form.Label>
                    <Form.Control.Feedback type="invalid" tooltip>
                      Неверные имя пользователя или пароль
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Button className="w-100 mb-3" variant="outline-primary" type="submit">Войти</Button>
                </fieldset>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                { ' ' }
                <Link to={routes.signupPage}>Регистрация</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
