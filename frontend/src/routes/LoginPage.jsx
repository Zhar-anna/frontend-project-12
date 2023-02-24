import { useFormik } from 'formik';
// import React, { useEffect, useRef, useState } from 'react';
import * as yup from 'yup';
import {
  Button, Form, FloatingLabel,
} from 'react-bootstrap';

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
    <Form onSubmit={formik.handleSubmit}>
      <h1 className="text-center mb-4">Login</h1>
      <FloatingLabel controlId="floatingUsername">
        <Form.Control
          name="usernsme"
          type="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          placeholder="Ваш ник"
          autoComplete="username"
        />
      </FloatingLabel>
      <FloatingLabel controlId="floatingPassword">
        <Form.Control
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Пароль"
          onChange={formik.handleChange}
          value={formik.values.password}
        />
      </FloatingLabel>
      <Button type="submit">Войти</Button>
    </Form>
  );
};

export default LoginPage;
