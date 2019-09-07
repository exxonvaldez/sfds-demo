/**
 * ProjectTimelineChart basic test.
 */

import React from 'react';
import { shallow } from 'enzyme';
import ProjectTimelineChart from './ProjectTimelineChart';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import PropTypes from 'prop-types';
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  ChartLabel,
  Crosshair,
} from 'react-vis';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
const store = mockStore({
  projects: [{
    project_id: 'test_id',
    project_name: 'test name'
  }],
  selectedProjectIDs: [],
});

it('shallow renders a project chart', () => {

  const wrapper = shallow(<ProjectTimelineChart store={store}/>).dive().dive();
  //console.log(wrapper.find(VerticalBarSeries).debug());
  expect(wrapper.find(VerticalBarSeries)).toHaveLength(1);
});

