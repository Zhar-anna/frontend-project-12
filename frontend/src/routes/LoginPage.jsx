import { useFormik } from 'formik';
import axios from 'axios';
import React, { useRef } from 'react';
import * as yup from 'yup';
import {
  Button, Form, FloatingLabel,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import tota from '../images/Tota.jpg';
import { useAuth } from '../contexts/index.jsx';
import routes from '../routes.js';

const validationSchema = yup.object().shape({
  username: yup.string().trim(),
  password: yup.string().trim(),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { logIn } = useAuth();
  const inputRef = useRef();
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, actions) => {
      try {
        const { data } = await axios.post(routes.login, values);
        if (data.token) {
          const user = { token: data.token, username: data.username };
          // localStorage.setItem('token', data.token);
          logIn(user);
          navigate(routes.homePage);
        }
      } catch (error) {
        console.error(error);
        if (!error.isAxiosError) {
          toast.error('Неизвестная ошибка');
          return;
        }
        if (error.responce?.status === 401) {
          actions.setFieldError('authentification', 'auth');
          inputRef.current.select();
        } else {
          toast.error('Ошибка сети');
        }
      }
    },
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
                <Form.Group className="form-floating mb-3" controlId="username">
                  <FloatingLabel className={formik.values.username && 'filled'} controlId="floatingUsername">
                    <Form.Control
                      name="usernsme"
                      type="username"
                      placeholder="Ваш ник"
                      autoComplete="username"
                      required
                      autoFocus
                      isInvalid={formik.errors.authentification}
                      onChange={formik.handleChange}
                      // value={formik.values.username}
                      ref={inputRef}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Form.Group className="form-floating mb-4" controlId="password">
                  <FloatingLabel className={formik.values.password && 'filled'} controlId="floatingPassword">
                    <Form.Control
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Пароль"
                      required
                      isInvalid={formik.errors.authentification}
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.authentication && 'Неверный логин или пароль'}
                    </Form.Control.Feedback>
                  </FloatingLabel>
                </Form.Group>
                <Button className="w-100 mb-3" variant="outline-primary" type="submit">Войти</Button>
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
