/**
 * ProjectTable basic test.
 */

import React from 'react';
import { shallow } from 'enzyme';
import ProjectTable from './ProjectTable';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({ projects: [{
  project_id: 'test_id',
  project_name: 'test name'
  }]
});
const storeWithError = mockStore({ projectsErr: { message: 'error message'} });


it('shallow renders a project name', () => {

  const wrapper = shallow(<ProjectTable store={store}/>).dive().dive();
  //console.log(wrapper.debug());
  expect(wrapper.text()).toMatch('test name');
});

it('shows error message', () => {

  const wrapper = shallow(<ProjectTable store={storeWithError}/>).dive().dive();

  expect(wrapper.text()).toMatch('error message');
  expect(wrapper.text()).toMatch('Unable to');
});


