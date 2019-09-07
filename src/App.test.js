/**
 * Full component render smoke test for App against a mock store.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import App from './App';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
      <Provider store={store}>
        <App />
      </Provider>, div);
  ReactDOM.unmountComponentAtNode(div);
});
