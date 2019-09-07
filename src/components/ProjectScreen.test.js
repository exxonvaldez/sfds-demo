/**
 * ProjectScreen basic test.
 */

import React from 'react';
import { shallow } from 'enzyme';
import ProjectScreen from './ProjectScreen';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({ projects: null, fetchProjects: jest.fn() });

it('shallow renders without crashing', () => {

  const wrapper = shallow(<ProjectScreen store={store}/>).dive().dive();

});

it('renders welcome message', () => {

  const wrapper = shallow(<ProjectScreen store={store}/>).dive().dive();

  // console.log(wrapper.debug()); // too much html in here to snapshot, note that
  // snapshotting a wrapper just gets an empty object

  const welcome = <h1>Affordable Rental Portfolio</h1>;
  expect(wrapper).toContainReact(welcome);

  // Note: useEffect is not triggered by shallow rendering yet, which would normally
  // result in an action being dispatched by ProjectScreen:
  //
  // https://github.com/airbnb/enzyme/issues/2086
  //
  // console.log(store.getActions());
});


