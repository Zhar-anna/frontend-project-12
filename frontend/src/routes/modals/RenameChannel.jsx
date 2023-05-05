import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useChatApi } from '../../hooks/index.jsx';

const validationSchema = (channelNames) => Yup.object().shape({
  channelName: Yup.string().trim()
  .notOneOf(channelNames, 'Must be unique'),
});

const Rename = ({ modalInfo: { item: channel }, onHide, channels }) => {
  const chatApi = useChatApi();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const channelNames = channels.map(({ name }) => name);
  const formik = useFormik({
    initialValues: { channelName: channel.name },
    validationSchema: validationSchema(channelNames),
    onSubmit: async (values) => {
      try {
        await chatApi.renameChannel({ id: channel.id, name: values.channelName });
        onHide();
      } catch (err) {
        console.error(err);
      }
    },
  });

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Stack gap={2}>
              <Form.Group controlId="formChannelName" className="position-relative">
                <Form.Label visuallyHidden>Имя канала</Form.Label>
                <Form.Control
                  ref={inputRef}
                  onChange={formik.handleChange}
                  // onBlur={f.handleBlur}
                  value={formik.values.channelName}
                  data-testid="input-channelName"
                  name="channelName"
                  isInvalid={formik.touched.channelName && formik.errors.channelName}
                />
                <Form.Control.Feedback type="invalid" tooltip className="position-absolute">
                  {formik.errors.channelName}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={onHide} variant="secondary" className="me-2">Отменить</Button>
                <Button type="submit" variant="primary">Отправить</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};