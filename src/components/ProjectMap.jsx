/**
 * react-leafet map of affordable housing projects.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import { handleProjectClick } from '../helpers/selectProjects';
import { setSelectedProjectIDs } from '../actions';

const SF_COORDINATES = {lat : 37.7793, lng: -122.4193}; // city hall
const ZOOM = 12;

class ProjectMap extends Component {

  constructor(props) {
    super(props);
  }

  /**
   * Rendering of stops nearest to click or current location
   */
  getProjectMarkers = (selectedProjectIDs, setSelectedProjectIDs) => {

    let items = null;

    if (this.props.projects) {
      items = this.props.projects.map((project, index) => {

        let position;
        if ((project.latitude === undefined) || (project.longitude === undefined)) {
          
          // Use City Hall as location if no coordinates available, offset slightly south by index
          
          position = [SF_COORDINATES.lat - index/100000, SF_COORDINATES.lng];
          
        } else {
          
          // Due to lack of precision of latitude (usually just two decimal places),
          // also offset slightly by index to help separate projects from each other.
          
          position = [ project.latitude - index/50000 + this.props.projects.length/2/50000, project.longitude ];
        }
        const unselectedColor = "rgb(130, 102, 188)"; // sfgov spotlight color
        const selectedColor = "rgb(79, 102, 238)"; // sfgov form element color
        const isItemSelected = selectedProjectIDs.indexOf(project.project_id) !== -1;
        const fillColor = isItemSelected ? selectedColor : unselectedColor;
        const fillOpacity = isItemSelected ? 1 : 0.15;
        const radius = isItemSelected ? 9 : 7; 

        return <CircleMarker key={ "projectMarker-" + project.project_id } center={position}
            radius={ radius } 
            fillColor={ fillColor }
            fillOpacity={ fillOpacity }
            stroke
            color={ "#000" }
            opacity={ 0.3 }
            weight={ 0.5 }
            onClick={event => handleProjectClick(event, project.project_id, selectedProjectIDs, setSelectedProjectIDs)}
      
            onMouseOver = { e => { // on hover, draw more opaque
              e.target.setStyle({
                radius: 12,
                fillOpacity: Math.max(fillOpacity, 0.6),
                fillColor: selectedColor,
              });
              return true;
            }}
            onMouseOut = { e => {
              e.target.setStyle({
                radius: radius,
                fillColor: fillColor,
                fillOpacity: fillOpacity,
              });
              return true;
            }}
            
            >
          <Tooltip direction="top" offset={[0,-10]} >
            {project.project_name}<br/>
            {project.street_number + " " + project.street_name + " " + 
              (project.street_type !== undefined ? project.street_type : '')
            }<br/>
            {project.affordable_units > 0 ? project.affordable_units + ' affordable units' : project.affordable_beds + ' affordable beds' }<br/>
            {project.project_sponsor}<br/>
          </Tooltip>
        </CircleMarker>
      });
    }

    return items;
  }

  /**
   * Main React render method.
   */
  render() {

    const mapClass = { width: '100%', height: '50vh' };
    
    let projectMarkers = this.getProjectMarkers(this.props.selectedProjectIDs, this.props.setSelectedProjectIDs);

    return (
      <div>
        <Map center={SF_COORDINATES} zoom={ZOOM} style={mapClass}
             minZoom={11}
             maxZoom={18}
             onClick={this.handleMapClick}
             onLocationfound={this.handleLocationFound}
             ref={this.mapRef}
        >
          <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
            url="https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png"
            opacity={0.4}
          /> {/* see http://maps.stamen.com for details */}
          {projectMarkers}

        </Map>
      </div>
    );
  }

}

const mapStateToProps = state => ({
  projects: state.projects,
  selectedProjectIDs: state.selectedProjectIDs,
});

const mapDispatchToProps = dispatch => {
  return ({  
    setSelectedProjectIDs: (selectedProjectIDs) => dispatch(setSelectedProjectIDs(selectedProjectIDs)),
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(ProjectMap);
