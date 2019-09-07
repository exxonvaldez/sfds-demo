/**
 * React-vis bar chart of total affordable units and beds by year affordability began. 
 */

import React, { useState } from 'react';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import {
  FlexibleWidthXYPlot,
  HorizontalGridLines,
  XAxis,
  YAxis,
  VerticalBarSeries,
  ChartLabel,
  Crosshair,
} from 'react-vis';
import '../../node_modules/react-vis/dist/style.css';

function ProjectTimelineChart(props) {

   const [crosshairValues, setCrosshairValues] = useState([]);

  /**
   * Event handler for onMouseLeave.
   * @private
   */
  const onMouseLeave = () => {
    setCrosshairValues([]);
  };

  /**
   * Event handler for onNearestX.
   * @param {Object} value Selected value.
   * @param {index} index Index of the value in the data array.
   * @private
   */
  const onNearestX = (value, { index }) => {
    setCrosshairValues([value]);
  };

  /**
   * Creates a react-vis data series for XYPlot.  Each data point is in form of:
   * {
   *  x: [x-value]
   *  y: [y-value]
   * }
   * 
   * where x is a year between 1973 and 2018 inclusive, and y is the number of
   * units and beds for all projects where affordability began that year.
   *
   * @param {Array} projects The array of project data.
   */
  const createSeries = (projects) => {
    
    if (!projects) { return null; }
    
    const unitsByYear = {};
    for (let year = 1973; year < 2019; year++) {
      unitsByYear[year] = 0;
    }
    
    projects.forEach(project => {
      unitsByYear[project.year_affordability_began] += Number.parseInt(project.affordable_units);
      unitsByYear[project.year_affordability_began] += Number.parseInt(project.affordable_beds);
    });
    
    const series = [];
    for (let year = 1973; year < 2019; year++) {
      series.push({x: year, y: unitsByYear[year]});
    }
    
    return series;
  }

  const { projects } = props;
  const series = createSeries(projects);
    
  return (
      <div>
        { projects ? (
              <Box maxWidth={800}> {/* can't seem to get this div centered */}

                <FlexibleWidthXYPlot
                  height={300}
                  margin={{left:80, bottom:80}}
                  stackBy="y"
                  onMouseLeave={onMouseLeave}
                >
                  <HorizontalGridLines />
                  <XAxis tickFormat={v => `${v}`} />
                  <YAxis hideLine />

                  <VerticalBarSeries
                    data={ series }
                    color="rgb(79, 102, 238)"
                    onNearestX={onNearestX}
                  />

                  <ChartLabel
                    text="Affordable Units and Beds"
                    className="alt-y-label"
                    includeMargin={true}
                    xPercent={0.02}
                    yPercent={-0.10}
                    style={{
                      transform: 'rotate(-90)',
                      textAnchor: 'end',
                    }}
                  />
        
                  <ChartLabel 
                    text="Year Affordability Began"
                    className="alt-x-label"
                    includeMargin={true}
                    xPercent={0.40}
                    yPercent={0.60}
                  />       
        

                  {crosshairValues.length > 0 && (
                    <Crosshair
                      values={crosshairValues}
                    >
                      <div className="rv-crosshair__inner__content" style={{width:150}}>
                        <p>
                          Year: {crosshairValues[0].x}<br/>
                          Units and Beds:{' '}
                          {Math.round(crosshairValues[0].y)}
                        </p>
                      </div>
                    </Crosshair>
                  )}
                </FlexibleWidthXYPlot>
              </Box>
        ) : null}
      </div>
    );
}

const mapStateToProps = state => ({
  projects: state.projects,
  selectedProjectIDs: state.selectedProjectIDs,
});

export default connect(mapStateToProps)(ProjectTimelineChart);
