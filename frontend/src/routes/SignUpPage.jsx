import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Card, Col, Container, FloatingLabel, Form, Image, Row, Stack,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import avatar from '../images/avatar.jpg';
import { useAuth } from '../contexts/index.jsx';
import paths from '../routes.js';

const validationSchema = Yup.object().shape({
  username: Yup.string().trim()
    .min(3, 'From 3 to 20 characters')
    .max(20, 'From 3 to 20 characters')
    .required('Required field'),
  password: Yup.string().trim()
    .min(6, 'At least 6 characters')
    .required('Required field'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required field'),
});
const useSubmit = (setSignupFailed) => {
  const navigate = useNavigate();
  const { logIn } = useAuth();
  return async (values) => {
    setSignupFailed(false);
    try {
      const res = await axios.post(paths.signup, values);
      logIn(res.data);
      navigate(paths.homePage);
    } catch (err) {
      if (!err.isAxiosError) throw err;
      console.error(err);
      if (err.response?.status === 409) setSignupFailed(true);
      else toast.error('Ошибка соединения');
    }
  };
};

const SignupPage = () => {
  const [signUpFailed, setSignUpFailed] = useState(false);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const formik = useFormik({
    initialValues: {
      username: '',
      passsword: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: useSubmit(setSignUpFailed),
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs="12" md="8" xxl="6">
          <Card>
            <Card.Body className="p-5">
              <Row>
                <Col className="d-flex align-items-center justify-content-center">
                  <Image src={avatar} roundedCircle thumbnail />
                </Col>
                <Col>
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <fieldset disabled={formik.isSubmitting}>
                      <Stack gap={2}>
                        <FloatingLabel controlId="floatingUsername" label="Имя пользователя" className="position-relative">
                          <Form.Control
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.username}
                            placeholder="Имя пользователя"
                            name="username"
                            autoComplete="username"
                            // eslint-disable-next-line max-len
                            isInvalid={signUpFailed || (formik.touched.username && formik.errors.username)}
                            ref={inputRef}
                          />
                          {signUpFailed && (
                          <Form.Control.Feedback type="invalid" tooltip className="position-absolute top-0 start-100">
                            Такой пользователь уже зарегистрирован
                          </Form.Control.Feedback>
                          )}
                          {formik.errors.username && (
                          <Form.Control.Feedback type="invalid" tooltip>
                            {formik.errors.username}
                          </Form.Control.Feedback>
                          )}
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPassword" label="Пароль">
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.password}
                            placeholder="Пароль"
                            name="password"
                            autoComplete="current-password"
                            isInvalid={formik.touched.password && formik.errors.password}
                          />
                          <Form.Control.Feedback type="invalid" tooltip>
                            {formik.errors.password}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                        <FloatingLabel controlId="floatingPasswordConfirmation" label="Подтвердите пароль">
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.passwordConfirmation}
                            placeholder="Подтвердите пароль"
                            name="passwordConfirmation"
                            autoComplete="current-passwordConfirmation"
                            isInvalid={formik.touched.passwordConfirmation
                  && formik.errors.passwordConfirmation}
                          />
                          <Form.Control.Feedback type="invalid" tooltip>
                            {formik.errors.passwordConfirmation}
                          </Form.Control.Feedback>
                        </FloatingLabel>
                        <Button type="submit" variant="outline-primary">Регистрация</Button>
                      </Stack>
                    </fieldset>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;
