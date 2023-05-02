import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux';
import init from './init.jsx';
// import App from './App.jsx';
// import store from './slices/index.js';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
// );
const app = async () => {
  const vdom = await init();
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      { vdom }
    </React.StrictMode>,
  );
};

app();
