import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';

import { useChatApi } from '../../contexts/index.jsx';

const Rename = ({ modalInfo: { item: channel }, onHide, channels }) => {
  const { t } = useTranslation();
  const validationSchema = (channelNames) => Yup.object().shape({
    channelName: Yup.string().trim()
      .min(3, t('login.symbolCount'))
      .max(20, t('login.symbolCount'))
      .required(t('login.requiredFiel'))
      .notOneOf(channelNames, t('login.unique')),
  });
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
        <Modal.Title>{t('channels.renameChannel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Stack gap={2}>
              <Form.Group controlId="formChannelName" className="position-relative">
                <Form.Label visuallyHidden htmlFor="renameChannel">{t('channels.name')}</Form.Label>
                <Form.Control
                  ref={inputRef}
                  onChange={formik.handleChange}
                  value={formik.values.channelName}
                  data-testid="input-channelName"
                  name="channelName"
                  isInvalid={formik.touched.channelName && formik.errors.channelName}
                  id="renameChannel"
                />
                <Form.Control.Feedback type="invalid" tooltip className="position-absolute">
                  {formik.errors.channelName}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={onHide} variant="secondary" className="me-2">{t('cancel')}</Button>
                <Button type="submit" variant="primary">{t('messages.send')}</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
