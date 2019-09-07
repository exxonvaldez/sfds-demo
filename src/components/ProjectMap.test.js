/**
 * ProjectMap basic test.
 */

import React from 'react';
import { shallow } from 'enzyme';
import ProjectMap from './ProjectMap';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import { Map, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  projects: [{
    project_id: 'test_id',
    project_name: 'test name'
  }],
  selectedProjectIDs: [],
});

it('shallow renders a project map', () => {

  const wrapper = shallow(<ProjectMap store={store}/>).dive().dive();
  //console.log(wrapper.find(Tooltip).text());
  expect(wrapper.find(Tooltip)).toHaveLength(1);
  expect(wrapper.find(Tooltip).text()).toMatch('test name');
});

