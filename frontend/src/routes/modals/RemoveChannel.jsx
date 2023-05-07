import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

import { useChatApi } from '../../contexts/index.jsx';

const Remove = ({ modalInfo: { item: channel }, onHide }) => {
  const chatApi = useChatApi();
  const [isSubmitting, setSubmitting] = useState(false);
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await chatApi.removeChannel({ id: channel.id });
      onHide();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Вы уверены?</p>
        <Form onSubmit={onSubmit}>
          <fieldset disabled={isSubmitting}>
            <div className="d-flex justify-content-end">
              <Button onClick={onHide} variant="secondary" className="me-2">Отменить</Button>
              <Button type="submit" variant="danger">Удалить</Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
