import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowRightSquareFill, PlusSquareFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import {
  Button, Col, Container, Row, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import axios from 'axios';
import { animateScroll } from 'react-scroll';
import profanityFilter from 'leo-profanity';
import routes from '../routes.js';
import { useAuth, useChatApi } from '../contexts/index.jsx';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelSlices.js';
import { actions as messagesActions, selectors as messagesSelectors } from '../slices/MessageSlices.js';
import { setCurrentChannelId } from '../slices/currentChannelIdSlice.js';
import getModal from './modals/index.jsx';

const renderModal = ({ modalInfo, hideModal, channels }) => {
  if (!modalInfo.type) return null;
  const ModalComponent = getModal(modalInfo.type);
  return (
    <ModalComponent
      modalInfo={modalInfo}
      onHide={hideModal}
      channels={channels}
    />
  );
};
const LeftCol = ({
  channels, currentChannelId, showModal,
}) => {
  const dispatch = useDispatch();
  return (
    <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button onClick={() => showModal('newChannel')} type="button" className="p-0 text-primary btn btn-group-vertical">
          <PlusSquareFill size={20} />
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((channel) => (
          <li className="nav-item w-100" key={channel.id}>
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button
                className="w-100 rounded-0 text-start text-truncate"
                variant={channel.id === currentChannelId && 'secondary'}
                onClick={() => { dispatch(setCurrentChannelId(channel.id)); }}
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
              {channel.removable && (
                <Dropdown.Toggle
                  split
                  variant={channel.id === currentChannelId && 'secondary'}
                >
                  <span className="visually-hidden">Действия с каналом</span>
                </Dropdown.Toggle>
              )}
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('removeChannel', channel)}>Удалить</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renameChannel', channel)}>Переименовать</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        ))}
      </ul>
    </Col>
  );
};
const MessagesBox = ({ currentChannelMessages }) => {
  useEffect(() => {
    animateScroll.scrollToBottom({ containerId: 'messages-box', delay: 0, duration: 0 });
  }, [currentChannelMessages.length]);
  return (
    <div id="messages-box" className="overflow-auto px-5 ">
      {currentChannelMessages.map(({ id, body, username }) => (
        <div key={id} className="text-break mb-2">
          <b>{username}</b>
          {`: ${body}`}
        </div>
      ))}
    </div>
  );
};
const SendingForm = ({ currentChannel, username }) => {
  const chatApi = useChatApi();
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage.length) return;
    const cleanedMessage = profanityFilter.clean(trimmedMessage);
    setSubmitting(true);
    try {
      await chatApi.newMessage({
        body: cleanedMessage,
        channelId: currentChannel.id,
        username,
      });
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-auto px-5 py-3">
      <form noValidate="" className="py-1 border rounded-2" onSubmit={submitHandler}>
        <fieldset disabled={isSubmitting}>
          <div className="input-group has-validation">
            <input
              name="body"
              aria-label="Новое сообщение"
              placeholder="Введите своё сообщение"
              className="border-0 p-0 ps-2 form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={inputRef}
            />
            <button type="submit" disabled="" className="btn btn-group-vertical">
              <ArrowRightSquareFill size={20} />
              <span className="visually-hidden">Отправить</span>
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

const RightCol = ({
  currentChannel, currentChannelMessages, username,
}) => (
  <Col className="p-0 h-100">
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0">
          <b>
            #
            {currentChannel?.name}
          </b>
        </p>
        <span className="text-muted">Количество сообщений</span>
      </div>
      <MessagesBox
        currentChannelMessages={currentChannelMessages}
      />
      <SendingForm
        currentChannel={currentChannel}
        username={username}
      />
    </div>
  </Col>
);

const getAuthHeader = (userData) => (
  userData?.token ? { Authorization: `Bearer ${userData.token}` } : {}
);

const ChatPage = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);
  const currentChannelId = useSelector((state) => state.currentChannelId.value);
  const currentChannel = useSelector(
    (state) => channelsSelectors.selectById(state, currentChannelId),
  );
  const currentChannelMessages = useSelector(messagesSelectors.selectAll)
    .filter(({ channelId }) => channelId === currentChannelId);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios
          .get(routes.httpDataPath, { headers: getAuthHeader(auth.userData) });
        dispatch(channelsActions.setChannels(data.channels));
        dispatch(messagesActions.setMessages(data.messages));
      } catch (err) {
        if (!err.isAxiosError) throw err;
        console.error(err);
        if (err.response?.status === 401) auth.logOut();
        else toast.error('Ошибка соединения');
      }
    };
    console.debug('ChatPage fetching content...');
    fetchContent();
  }, [auth, dispatch]);

  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <LeftCol
          channels={channels}
          currentChannelId={currentChannelId}
          showModal={showModal}
        />
        <RightCol
          currentChannel={currentChannel}
          currentChannelMessages={currentChannelMessages}
          username={auth.userData.username}
        />
      </Row>
      {renderModal({ modalInfo, hideModal, channels })}
    </Container>
  );
};

export default ChatPage;
