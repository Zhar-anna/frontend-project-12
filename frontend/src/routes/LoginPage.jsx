import { useFormik } from 'formik';
// import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  Button, Form, FloatingLabel,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import tota from '../images/Tota.jpg';

const validationSchema = yup.object().shape({
  username: yup.string().trim(),
  password: yup.string().trim(),
});

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema,
    // onSubmit: values => {
    //   alert(JSON.stringify(values, null, 2));
    // },
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
                  <FloatingLabel controlId="floatingUsername">
                    <Form.Control
                      name="usernsme"
                      type="username"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      placeholder="Ваш ник"
                      autoComplete="username"
                      required
                    />
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingPassword">
                    <Form.Control
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      placeholder="Пароль"
                      required
                      onChange={formik.handleChange}
                      value={formik.values.password}
                    />
                  </FloatingLabel>
                </Form.Group>
                <Button className="w-100 mb-3" type="submit">Войти</Button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>Нет аккаунта?</span>
                <Link to="/login">Регистрация</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
