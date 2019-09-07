/**
 * All action creators.
 */

import axios from 'axios';

export const projectsUrl = 'https://data.sfgov.org/resource/9rdx-httc.json';

/**
 * Action to get the housing data.
 */
export function fetchProjects() {
  return function(dispatch) {
    axios
      .get(projectsUrl)
      .then(response => {
        dispatch({ type: 'RECEIVED_PROJECTS', payload: response.data });
      })
      .catch(err => {
        dispatch({ type: 'RECEIVED_PROJECTS_ERROR', payload: err });
      });
  };
}

/**
 * Action to update selected projects.
 *
 * @param {string[]} selectedProjectIDs The full list of selected projects.
 */
export function setSelectedProjectIDs(selectedProjectIDs) {
  return function(dispatch) {
    dispatch({ type: 'SELECTED_PROJECTS', payload: selectedProjectIDs})
  }
}