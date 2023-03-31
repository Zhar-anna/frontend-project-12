import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PlusSquareFill } from 'react-bootstrap-icons';
import { toast } from 'react-toastify';
import {
  Button, Col, Container, Row, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import axios from 'axios';
import routes from '../routes.js';
import { useAuth } from '../contexts/index.jsx';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelSlices.js';

const LeftCol = ({
  channels,
}) => {
  // const dispatch = useDispatch();
  console.log(channels);
  return (
    <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Каналы</span>
        <button type="button" className="p-0 text-primary btn btn-group-vertical">
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
              >
                <span className="me-1">#</span>
                {channel.name}
              </Button>
            </Dropdown>
          </li>
        ))}
      </ul>
    </Col>
  );
};

const getAuthHeader = (userData) => (
  userData?.token ? { Authorization: `Bearer ${userData.token}` } : {}
);

const ChatPage = () => {
  const auth = useAuth();
  const dispatch = useDispatch();

  const channels = useSelector(channelsSelectors.selectAll);
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get(routes.httpDataPath, { headers: getAuthHeader(auth.userData) }); // eslint-disable-line max-len
        dispatch(channelsActions.setChannels(data.channels));
        //   dispatch(messagesActions.setMessages(data.messages));
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

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <LeftCol
          channels={channels}
        />
        <Col
          currentChannel={channels}
          username={auth.userData.username}
        />
      </Row>
    </Container>
  );
};

export default ChatPage;
