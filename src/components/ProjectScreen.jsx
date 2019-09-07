/**
 * Main app page that mimics an sf.gov information page and embeds the other components
 * to display data.
 */

import React, { useEffect } from 'react';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import { connect } from 'react-redux';

import { fetchProjects } from '../actions';
import ProjectMap from './ProjectMap';
import ProjectTable from './ProjectTable';
import ProjectTimelineChart from './ProjectTimelineChart';

function ProjectScreen(props) {

  const { projects, fetchProjects } = props;

  /**
   * On first render, request the housing project data if it isn't there yet. 
   */
  useEffect(() => {
    if (!projects) {
      fetchProjects();
    }
  }, [projects, fetchProjects]);

  return (
    <div>
      <div className="sfgov-alpha-banner">
        <Container maxWidth="lg" className="sfgov-alpha-banner__container">
          <div className="sfgov-alpha-banner__content">
            <p>This is a demo project for <a href="https://digitalservices.sfgov.org/">San Francisco Digital Services</a>.</p>
          </div>
        </Container>
      </div>

      <Container maxWidth="lg">
        <Box pt={6} pb={6}>
          [ SF.GOV banner placeholder. ]
        </Box>
      </Container>            
            
            
          
      <header className="hero-banner color">
        <div className="hero-banner--container">
          <Container maxWidth="lg">
      
          <h1>Affordable Rental Portfolio</h1>
          <h3 className="lead-paragraph">
            <div className="field field--type-text-long __description field__item">
              Affordable rental housing developed in partnership with non-profit and private developers and financed
              by the Mayor’s Office of Housing and Community Development (MOHCD) and the Office of Community Investment
              and Infrastructure (OCII) through City Funding Agreements, Ground Leases, Disposition & Participation
              Agreements and Conduit Mortgage Revenue Bond Financing, as of December 31, 2018.      
            </div>
          </h3>
          </Container>
                
        </div>
      </header>

              
              
      <Container maxWidth="lg">

        <div className="transaction--left">
          <div className="sfgov-section">
            <h2 className="sfgov-section__title">Map of Affordable Rental Projects</h2>          
            <div className="sfgov-section__content">
              
              <p>Click a project to select or unselect it.</p>

              <ProjectMap/>

            </div>
          </div>
        </div>

        <div className="transaction--left">
          <div className="sfgov-section">
            <h2 className="sfgov-section__title">Table of Affordable Rental Projects</h2>
            <div className="sfgov-section__content">
        
              <p>Click a row to select it.  Selections are highlighted on the map.</p>
        
              <ProjectTable/>
                
            </div>                
          </div>
        </div>
        
        <div className="transaction--left">
          <div className="sfgov-section">
            <h2 className="sfgov-section__title">Number of Affordable Units by Year</h2>          
            <div className="sfgov-section__content">
        
              <ProjectTimelineChart/>
              
            </div>
          </div>
        </div>
                  
      </Container>
        
      <div className="info--departments-container">
        <div className="info--departments">
          <div className="field field--type-entity-reference __dept">
            <h4 className="field__label">Departments</h4>
            <div className="field__items">
              <div className="field__item"><a href="https://sf.gov/departments/mayors-office-housing-and-community-development" hrefLang="en">Mayor's Office of Housing and Community Development</a></div>
              </div>
            </div>
         </div>
      </div>        
          
      <footer className="sfgov-footer">
         <Box p={12}>
            SF.GOV footer placeholder.
         </Box>
      </footer>
    </div>
  );
}

const mapStateToProps = state => ({
  projects: state.projects,
});

const mapDispatchToProps = dispatch => ({
  fetchProjects: () => dispatch(fetchProjects()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProjectScreen);
